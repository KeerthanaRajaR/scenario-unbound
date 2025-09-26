import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, FileText } from 'lucide-react';
import { Scenario } from '@/types/database';
import { MockFunctions } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  onScenarioChange: (scenarioId: string) => void;
  onScenariosUpdate: () => void;
}

export const ScenarioSelector = ({ 
  scenarios, 
  currentScenario, 
  onScenarioChange, 
  onScenariosUpdate 
}: ScenarioSelectorProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateScenario = async () => {
    if (!newScenarioName.trim()) return;

    setIsCreating(true);
    try {
      await MockFunctions.createScenario({
        name: newScenarioName,
        founders: [
          { name: 'Founder 1', equity: 50 },
          { name: 'Founder 2', equity: 50 }
        ]
      });

      toast({
        title: "Scenario created",
        description: `"${newScenarioName}" has been created successfully.`,
      });

      setNewScenarioName('');
      setIsCreateOpen(false);
      onScenariosUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scenario. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-8 p-6 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Current Scenario</h2>
          <p className="text-sm text-muted-foreground">
            Model your startup equity across funding rounds
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={currentScenario?.id || ''}
          onValueChange={onScenarioChange}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a scenario" />
          </SelectTrigger>
          <SelectContent>
            {scenarios.map((scenario) => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Scenario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Scenario</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="scenario-name">Scenario Name</Label>
                <Input
                  id="scenario-name"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="Enter scenario name..."
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateScenario}
                  disabled={!newScenarioName.trim() || isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Scenario'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};