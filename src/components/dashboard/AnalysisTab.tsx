import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';
import { ScenarioData } from '@/types/database';

interface AnalysisTabProps {
  scenarioData: ScenarioData | null;
}

export const AnalysisTab = ({ scenarioData }: AnalysisTabProps) => {
  if (!scenarioData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No scenario data available for analysis.</p>
      </div>
    );
  }

  const { founders, rounds } = scenarioData;
  
  // Calculate dilution impact on founders
  const totalDilution = rounds.reduce((sum, round) => sum + round.dilution, 0);
  const foundersAfterDilution = founders.map(founder => ({
    ...founder,
    currentEquity: founder.equity * (1 - totalDilution / 100)
  }));

  const totalFunding = rounds.reduce((sum, round) => sum + round.investment, 0);
  const currentValuation = rounds.length > 0 
    ? rounds[rounds.length - 1].valuation + rounds[rounds.length - 1].investment 
    : 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Valuation</p>
                <p className="text-2xl font-bold">{formatCurrency(currentValuation)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Dilution</p>
                <p className="text-2xl font-bold">{totalDilution.toFixed(1)}%</p>
              </div>
              <PieChart className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Funding</p>
                <p className="text-2xl font-bold">{formatCurrency(totalFunding)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Funding Rounds</p>
                <p className="text-2xl font-bold">{rounds.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Founder Equity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Founder Equity After Dilution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {foundersAfterDilution.map((founder, index) => {
              const equityValue = currentValuation * (founder.currentEquity / 100);
              const dilutionImpact = founder.equity - founder.currentEquity;
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{founder.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Original: {founder.equity.toFixed(1)}% → Current: {founder.currentEquity.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(equityValue)}</p>
                      <Badge variant={dilutionImpact > 10 ? "destructive" : "secondary"}>
                        -{dilutionImpact.toFixed(1)}% diluted
                      </Badge>
                    </div>
                  </div>
                  <Progress value={founder.currentEquity} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Funding Round Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Funding Round Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rounds.map((round, index) => {
              const postMoneyValuation = round.valuation + round.investment;
              const previousValuation = index > 0 ? rounds[index - 1].valuation + rounds[index - 1].investment : 0;
              const valuationGrowth = previousValuation > 0 
                ? ((round.valuation - previousValuation) / previousValuation * 100) 
                : 0;

              return (
                <div key={round.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{round.name}</h4>
                      <p className="text-sm text-muted-foreground">{round.date}</p>
                    </div>
                    {valuationGrowth > 0 && (
                      <Badge variant="default">
                        +{valuationGrowth.toFixed(1)}% growth
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Investment</p>
                      <p className="font-semibold">{formatCurrency(round.investment)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pre-Money</p>
                      <p className="font-semibold">{formatCurrency(round.valuation)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Post-Money</p>
                      <p className="font-semibold">{formatCurrency(postMoneyValuation)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dilution Impact</span>
                      <span className="font-medium">{round.dilution.toFixed(2)}%</span>
                    </div>
                    <Progress value={round.dilution} className="h-1 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};