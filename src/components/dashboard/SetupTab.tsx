import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Users } from 'lucide-react';
import { ScenarioData, Founder } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface SetupTabProps {
  scenarioData: ScenarioData | null;
  onUpdate: () => void;
}

export const SetupTab = ({ scenarioData, onUpdate }: SetupTabProps) => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [newFounderName, setNewFounderName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (scenarioData?.founders) {
      setFounders(scenarioData.founders);
    }
  }, [scenarioData]);

  const addFounder = () => {
    if (!newFounderName.trim()) return;

    const remainingEquity = 100 - founders.reduce((sum, f) => sum + f.equity, 0);
    if (remainingEquity <= 0) {
      toast({
        title: "Cannot add founder",
        description: "Total equity allocation cannot exceed 100%.",
        variant: "destructive",
      });
      return;
    }

    const newFounder: Founder = {
      name: newFounderName.trim(),
      equity: Math.min(remainingEquity, 10) // Default to 10% or remaining equity
    };

    setFounders([...founders, newFounder]);
    setNewFounderName('');
    
    toast({
      title: "Founder added",
      description: `${newFounder.name} has been added with ${newFounder.equity}% equity.`,
    });
  };

  const removeFounder = (index: number) => {
    const founder = founders[index];
    setFounders(founders.filter((_, i) => i !== index));
    
    toast({
      title: "Founder removed",
      description: `${founder.name} has been removed from the scenario.`,
    });
  };

  const updateFounderEquity = (index: number, equity: number) => {
    const updatedFounders = [...founders];
    updatedFounders[index].equity = Math.max(0, Math.min(100, equity));
    setFounders(updatedFounders);
  };

  const updateFounderName = (index: number, name: string) => {
    const updatedFounders = [...founders];
    updatedFounders[index].name = name;
    setFounders(updatedFounders);
  };

  const totalEquity = founders.reduce((sum, founder) => sum + founder.equity, 0);
  const isEquityValid = totalEquity <= 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Founders & Equity Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Equity Overview */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Equity Allocated</span>
              <Badge variant={isEquityValid ? "default" : "destructive"}>
                {totalEquity.toFixed(1)}%
              </Badge>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isEquityValid ? 'bg-success' : 'bg-destructive'
                }`}
                style={{ width: `${Math.min(totalEquity, 100)}%` }}
              />
            </div>
            {!isEquityValid && (
              <p className="text-sm text-destructive mt-2">
                Total equity cannot exceed 100%. Please adjust founder allocations.
              </p>
            )}
          </div>

          {/* Founders List */}
          <div className="space-y-4">
            {founders.map((founder, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`founder-name-${index}`}>Founder Name</Label>
                  <Input
                    id={`founder-name-${index}`}
                    value={founder.name}
                    onChange={(e) => updateFounderName(index, e.target.value)}
                    placeholder="Enter founder name"
                    className="mt-1"
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor={`founder-equity-${index}`}>Equity %</Label>
                  <Input
                    id={`founder-equity-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={founder.equity}
                    onChange={(e) => updateFounderEquity(index, parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFounder(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Founder */}
          <div className="flex items-end gap-4 p-4 border border-dashed border-border rounded-lg">
            <div className="flex-1">
              <Label htmlFor="new-founder">Add New Founder</Label>
              <Input
                id="new-founder"
                value={newFounderName}
                onChange={(e) => setNewFounderName(e.target.value)}
                placeholder="Enter founder name"
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && addFounder()}
              />
            </div>
            <Button onClick={addFounder} disabled={!newFounderName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Founder
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">Total Founders</p>
              <p className="text-2xl font-bold">{founders.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remaining Equity</p>
              <p className={`text-2xl font-bold ${100 - totalEquity >= 0 ? 'text-success' : 'text-destructive'}`}>
                {(100 - totalEquity).toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};