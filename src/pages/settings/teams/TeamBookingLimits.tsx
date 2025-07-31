import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

export const TeamBookingLimits = () => {
  const { teamId } = useParams();
  const [limits, setLimits] = useState<Array<{
    id: string;
    value: string;
    period: string;
  }>>([]);

  const handleSave = () => {
    console.log('Saving booking limits:', { limits });
  };

  const addLimit = () => {
    const newLimit = {
      id: Date.now().toString(),
      value: '5',
      period: 'day'
    };
    setLimits([...limits, newLimit]);
  };

  const removeLimit = (id: string) => {
    setLimits(limits.filter(limit => limit.id !== id));
  };

  const updateLimit = (id: string, field: 'value' | 'period', value: string) => {
    setLimits(limits.map(limit => limit.id === id ? {
      ...limit,
      [field]: value
    } : limit));
  };

  return (
    <div className="min-h-screen bg-background flex justify-center animate-fade-in">
      <div className="py-4 w-full">
        <div className="border rounded-lg p-6 bg-card hover:bg-muted/20 transition-colors duration-200 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium">Add booking limits</h4>
                <p className="text-sm text-muted-foreground">Set limits on the number of bookings</p>
              </div>
              <Button 
                onClick={addLimit} 
                variant="outline" 
                size="sm"
                className="hover:scale-105 transition-transform duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add limit
              </Button>
            </div>

            {limits.length > 0 && (
              <div className="space-y-3 animate-fade-in">
                {limits.map((limit) => (
                  <div 
                    key={limit.id} 
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/20 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <Label className="text-sm">Limit</Label>
                      <Input 
                        type="number" 
                        value={limit.value} 
                        onChange={e => updateLimit(limit.id, 'value', e.target.value)} 
                        className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20" 
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Label className="text-sm">Per</Label>
                      <Select 
                        value={limit.period} 
                        onValueChange={value => updateLimit(limit.id, 'period', value)}
                      >
                        <SelectTrigger className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hour">Hour</SelectItem>
                          <SelectItem value="day">Day</SelectItem>
                          <SelectItem value="week">Week</SelectItem>
                          <SelectItem value="month">Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeLimit(limit.id)} 
                      className="mt-6 text-destructive hover:text-destructive hover:scale-110 transition-transform duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {limits.length === 0 && (
              <div className="text-center py-8 text-muted-foreground animate-fade-in">
                <p className="text-sm">No booking limits set. Click "Add limit" to create one.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-6 animate-fade-in">
            <Button 
              onClick={handleSave}
              className="hover:scale-105 transition-transform duration-200"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
