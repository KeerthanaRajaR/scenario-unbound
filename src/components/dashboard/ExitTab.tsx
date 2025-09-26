import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Target, TrendingUp, Calculator } from 'lucide-react';
import { ScenarioData } from '@/types/database';

interface ExitTabProps {
  scenarioData: ScenarioData | null;
}

export const ExitTab = ({ scenarioData }: ExitTabProps) => {
  const [exitValuation, setExitValuation] = useState<number>(0);
  const [exitType, setExitType] = useState<string>('acquisition');
  const [exitMultiple, setExitMultiple] = useState<number>(3);

  if (!scenarioData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No scenario data available for exit analysis.</p>
      </div>
    );
  }

  const { founders, rounds } = scenarioData;
  
  // Calculate current state after all dilution
  const totalDilution = rounds.reduce((sum, round) => sum + round.dilution, 0);
  const currentValuation = rounds.length > 0 
    ? rounds[rounds.length - 1].valuation + rounds[rounds.length - 1].investment 
    : 1000000; // Default 1M if no rounds

  const foundersAfterDilution = founders.map(founder => ({
    ...founder,
    currentEquity: founder.equity * (1 - totalDilution / 100)
  }));

  // Calculate exit scenarios
  const calculateExitReturns = (valuation: number) => {
    return foundersAfterDilution.map(founder => ({
      ...founder,
      exitValue: valuation * (founder.currentEquity / 100)
    }));
  };

  const quickExitScenarios = [
    { label: '1x Current', multiple: 1, valuation: currentValuation },
    { label: '3x Current', multiple: 3, valuation: currentValuation * 3 },
    { label: '5x Current', multiple: 5, valuation: currentValuation * 5 },
    { label: '10x Current', multiple: 10, valuation: currentValuation * 10 }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const customExitReturns = exitValuation > 0 ? calculateExitReturns(exitValuation) : [];
  const totalFunding = rounds.reduce((sum, round) => sum + round.investment, 0);
  const exitMultipleCalculated = exitValuation > 0 ? exitValuation / totalFunding : 0;

  return (
    <div className="space-y-6">
      {/* Exit Scenario Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exit Scenario Modeling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exit-type">Exit Type</Label>
              <Select value={exitType} onValueChange={setExitType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acquisition">Acquisition</SelectItem>
                  <SelectItem value="ipo">IPO</SelectItem>
                  <SelectItem value="merger">Merger</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exit-valuation">Exit Valuation</Label>
              <Input
                id="exit-valuation"
                type="number"
                min="0"
                step="1000000"
                value={exitValuation}
                onChange={(e) => setExitValuation(parseFloat(e.target.value) || 0)}
                placeholder="Enter exit valuation"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="multiple-display">Return Multiple</Label>
              <div className="mt-1 p-2 bg-muted rounded-md text-center">
                <span className="text-lg font-semibold">
                  {exitMultipleCalculated.toFixed(1)}x
                </span>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Valuation</p>
                <p className="text-lg font-semibold">{formatCurrency(currentValuation)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Funding</p>
                <p className="text-lg font-semibold">{formatCurrency(totalFunding)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Founder Equity</p>
                <p className="text-lg font-semibold">
                  {foundersAfterDilution.reduce((sum, f) => sum + f.currentEquity, 0).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Quick Exit Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickExitScenarios.map((scenario, index) => {
              const returns = calculateExitReturns(scenario.valuation);
              const totalFounderValue = returns.reduce((sum, r) => sum + r.exitValue, 0);
              
              return (
                <div key={index} className="p-4 border border-border rounded-lg">
                  <div className="text-center mb-3">
                    <Badge variant="outline">{scenario.label}</Badge>
                    <p className="text-lg font-semibold mt-1">
                      {formatCurrency(scenario.valuation)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Founder Returns</p>
                      <p className="font-medium">{formatCurrency(totalFounderValue)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setExitValuation(scenario.valuation)}
                    >
                      Use This Scenario
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Exit Analysis */}
      {exitValuation > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Exit Returns Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Exit Valuation</p>
                  <p className="text-lg font-semibold">{formatCurrency(exitValuation)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Return Multiple</p>
                  <p className="text-lg font-semibold">{exitMultipleCalculated.toFixed(1)}x</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                  <p className="text-lg font-semibold text-success">
                    {formatCurrency(customExitReturns.reduce((sum, r) => sum + r.exitValue, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profit</p>
                  <p className="text-lg font-semibold text-success">
                    {formatCurrency(exitValuation - totalFunding)}
                  </p>
                </div>
              </div>

              {/* Individual Founder Returns */}
              <div className="space-y-4">
                <h4 className="font-medium">Individual Founder Returns</h4>
                {customExitReturns.map((founder, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h5 className="font-medium">{founder.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {founder.currentEquity.toFixed(2)}% equity
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-success">
                        {formatCurrency(founder.exitValue)}
                      </p>
                      <Badge variant="default">
                        {((founder.exitValue / exitValuation) * 100).toFixed(1)}% of exit
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};