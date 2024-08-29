import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadFile, removeFile, listFiles, createCollection, listCollections } from '@/lib/api';
import { toast } from 'sonner';

const Index = () => {
  const queryClient = useQueryClient();
  const [newCollectionName, setNewCollectionName] = useState('');

  const { data: s3Files, isLoading: isLoadingFiles } = useQuery({
    queryKey: ['s3Files'],
    queryFn: async () => {
      const [json, description, image] = await Promise.all([
        listFiles('json'),
        listFiles('description'),
        listFiles('image')
      ]);
      return { json, description, image };
    }
  });

  const { data: vdbCollections, isLoading: isLoadingCollections } = useQuery({
    queryKey: ['vdbCollections'],
    queryFn: listCollections
  });

  const uploadMutation = useMutation({
    mutationFn: ({ folder, file }) => uploadFile(folder, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['s3Files']);
      toast.success('File uploaded successfully');
    },
    onError: () => toast.error('Failed to upload file')
  });

  const removeMutation = useMutation({
    mutationFn: ({ folder, fileName }) => removeFile(folder, fileName),
    onSuccess: () => {
      queryClient.invalidateQueries(['s3Files']);
      toast.success('File removed successfully');
    },
    onError: () => toast.error('Failed to remove file')
  });

  const createCollectionMutation = useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(['vdbCollections']);
      setNewCollectionName('');
      toast.success('Collection created successfully');
    },
    onError: () => toast.error('Failed to create collection')
  });

  const handleFileUpload = (folder, file) => {
    uploadMutation.mutate({ folder, file });
  };

  const handleFileRemove = (folder, fileName) => {
    removeMutation.mutate({ folder, fileName });
  };

  const handleCreateCollection = () => {
    if (newCollectionName) {
      createCollectionMutation.mutate(newCollectionName);
    }
  };

  if (isLoadingFiles || isLoadingCollections) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">S3 and Vector Database Manager</h1>
      
      <Tabs defaultValue="s3" className="w-full">
        <TabsList>
          <TabsTrigger value="s3">S3 Operations</TabsTrigger>
          <TabsTrigger value="vdb">Vector DB Operations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="s3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['json', 'description', 'image'].map(folder => (
              <div key={folder} className="border p-4 rounded">
                <h2 className="text-xl font-semibold mb-2 capitalize">{folder} Files</h2>
                <Input type="file" onChange={(e) => handleFileUpload(folder, e.target.files[0])} />
                <ul className="mt-4">
                  {s3Files && s3Files[folder].map(file => (
                    <li key={file} className="flex justify-between items-center">
                      {file}
                      <Button variant="destructive" size="sm" onClick={() => handleFileRemove(folder, file)}>Remove</Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="vdb">
          <div className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Vector Database Operations</h2>
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="New collection name" 
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <Button onClick={handleCreateCollection}>Create Collection</Button>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {vdbCollections && vdbCollections.map(collection => (
                  <SelectItem key={collection} value={collection}>{collection}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;