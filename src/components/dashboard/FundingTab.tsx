import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { ScenarioData, FundingRound } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface FundingTabProps {
  scenarioData: ScenarioData | null;
  onUpdate: () => void;
}

export const FundingTab = ({ scenarioData, onUpdate }: FundingTabProps) => {
  const [rounds, setRounds] = useState<FundingRound[]>([]);
  const [isAddingRound, setIsAddingRound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (scenarioData?.rounds) {
      setRounds(scenarioData.rounds);
    }
  }, [scenarioData]);

  const addNewRound = () => {
    const newRound: FundingRound = {
      id: `round-${Date.now()}`,
      name: `Round ${rounds.length + 1}`,
      investment: 0,
      valuation: 0,
      dilution: 0,
      date: new Date().toISOString().split('T')[0]
    };

    setRounds([...rounds, newRound]);
    setIsAddingRound(false);
    
    toast({
      title: "Funding round added",
      description: `${newRound.name} has been added to your scenario.`,
    });
  };

  const removeRound = (index: number) => {
    const round = rounds[index];
    setRounds(rounds.filter((_, i) => i !== index));
    
    toast({
      title: "Funding round removed",
      description: `${round.name} has been removed from the scenario.`,
    });
  };

  const updateRound = (index: number, field: keyof FundingRound, value: string | number) => {
    const updatedRounds = [...rounds];
    updatedRounds[index] = { ...updatedRounds[index], [field]: value };

    // Auto-calculate dilution if investment and valuation are provided
    if (field === 'investment' || field === 'valuation') {
      const round = updatedRounds[index];
      if (round.investment > 0 && round.valuation > 0) {
        round.dilution = (round.investment / round.valuation) * 100;
      }
    }

    setRounds(updatedRounds);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const totalFunding = rounds.reduce((sum, round) => sum + round.investment, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Funding Rounds
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Funding Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Funding</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalFunding)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Funding Rounds</p>
              <p className="text-2xl font-bold">{rounds.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Round Size</p>
              <p className="text-2xl font-bold">
                {rounds.length > 0 ? formatCurrency(totalFunding / rounds.length) : '$0'}
              </p>
            </div>
          </div>

          {/* Funding Rounds */}
          <div className="space-y-4">
            {rounds.map((round, index) => (
              <div key={round.id} className="p-6 border border-border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{`Round ${index + 1}`}</Badge>
                    <Input
                      value={round.name}
                      onChange={(e) => updateRound(index, 'name', e.target.value)}
                      placeholder="Round name"
                      className="w-48"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={round.date}
                      onChange={(e) => updateRound(index, 'date', e.target.value)}
                      className="w-40"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeRound(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`investment-${index}`}>Investment Amount</Label>
                    <Input
                      id={`investment-${index}`}
                      type="number"
                      min="0"
                      step="1000"
                      value={round.investment}
                      onChange={(e) => updateRound(index, 'investment', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`valuation-${index}`}>Pre-Money Valuation</Label>
                    <Input
                      id={`valuation-${index}`}
                      type="number"
                      min="0"
                      step="1000"
                      value={round.valuation}
                      onChange={(e) => updateRound(index, 'valuation', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`dilution-${index}`}>Dilution %</Label>
                    <Input
                      id={`dilution-${index}`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={round.dilution.toFixed(2)}
                      onChange={(e) => updateRound(index, 'dilution', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                      readOnly={round.investment > 0 && round.valuation > 0}
                    />
                  </div>
                </div>

                {round.investment > 0 && round.valuation > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Post-money valuation: {formatCurrency(round.valuation + round.investment)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Round */}
          <div className="flex justify-center">
            <Button onClick={addNewRound} variant="outline" className="w-full max-w-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Funding Round
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};