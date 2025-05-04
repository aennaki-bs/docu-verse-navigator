import { useState, useMemo } from 'react';
import { X, Plus, Sliders, Calendar, Tag, FileText, Hash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterCondition {
  field: string;
  operator: string;
  value: string | number | DateRange | boolean | null;
  id: string;
}

interface DocumentTypeFiltersProps {
  onFilterChange: (filters: any) => void;
  onClose: () => void;
}

const DocumentTypeFilters = ({ onFilterChange, onClose }: DocumentTypeFiltersProps) => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [newFilter, setNewFilter] = useState<FilterCondition>({
    field: 'typeName',
    operator: 'contains',
    value: '',
    id: crypto.randomUUID()
  });
  
  // Count filter for document counter
  const [countRange, setCountRange] = useState<[number, number]>([0, 100]);
  
  // Date filter shortcuts
  const [dateOption, setDateOption] = useState<string>("anytime");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  
  // Quick filters
  const [showEmpty, setShowEmpty] = useState<boolean>(false);
  const [showActive, setShowActive] = useState<boolean>(true);
  
  const fieldIcons = {
    typeName: <FileText className="h-4 w-4" />,
    typeKey: <Tag className="h-4 w-4" />,
    documentCounter: <Hash className="h-4 w-4" />,
    createdAt: <Calendar className="h-4 w-4" />,
    updatedAt: <Calendar className="h-4 w-4" />
  };
  
  const fieldLabels = {
    typeName: "Type Name",
    typeKey: "Type Code",
    documentCounter: "Document Count",
    createdAt: "Created Date",
    updatedAt: "Updated Date"
  };
  
  const operators = useMemo(() => ({
    string: [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' }
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'Greater than' },
      { value: 'lessThan', label: 'Less than' },
      { value: 'between', label: 'Between' }
    ],
    date: [
      { value: 'after', label: 'After' },
      { value: 'before', label: 'Before' },
      { value: 'between', label: 'Between' },
      { value: 'equals', label: 'On date' }
    ]
  }), []);
  
  const getOperatorsByField = (field: string) => {
    if (field === 'documentCounter') return operators.number;
    if (field === 'createdAt' || field === 'updatedAt') return operators.date;
    return operators.string;
  };
  
  const isDateField = (field: string) => field === 'createdAt' || field === 'updatedAt';
  const isNumberField = (field: string) => field === 'documentCounter';
  
  const addFilter = () => {
    // Only add filter if it has a value
    if (newFilter.value === '' || newFilter.value === null) return;
    
    setFilters([...filters, { ...newFilter, id: crypto.randomUUID() }]);
    setNewFilter({
      field: 'typeName',
      operator: 'contains',
      value: '',
      id: crypto.randomUUID()
    });
  };
  
  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };
  
  const handleFieldChange = (value: string) => {
    const defaultOperator = isDateField(value) 
      ? 'after' 
      : isNumberField(value) 
        ? 'greaterThan' 
        : 'contains';
        
    setNewFilter({
      ...newFilter,
      field: value,
      operator: defaultOperator,
      value: '',
    });
  };
  
  const handleOperatorChange = (value: string) => {
    setNewFilter({
      ...newFilter,
      operator: value,
    });
  };
  
  const handleValueChange = (value: string | number | DateRange | null) => {
    setNewFilter({
      ...newFilter,
      value,
    });
  };
  
  const handleApplyFilters = () => {
    // Combine all filter types
    const allFilters = {
      conditions: filters,
      countRange: countRange,
      dateOption: dateOption,
      customDateRange: customDateRange,
      showEmpty: showEmpty,
      showActive: showActive
    };
    
    onFilterChange(allFilters);
  };
  
  const handleClearFilters = () => {
    setFilters([]);
    setCountRange([0, 100]);
    setDateOption("anytime");
    setCustomDateRange(undefined);
    setShowEmpty(false);
    setShowActive(true);
    onFilterChange({});
  };
  
  // Generate a human-readable filter summary
  const filterSummary = useMemo(() => {
    const parts = [];
    
    if (filters.length > 0) {
      parts.push(`${filters.length} condition${filters.length > 1 ? 's' : ''}`);
    }
    
    if (countRange[0] > 0 || countRange[1] < 100) {
      parts.push(`Document count: ${countRange[0]}-${countRange[1]}`);
    }
    
    if (dateOption !== 'anytime') {
      parts.push(`Date: ${dateOption}`);
    }
    
    if (showEmpty) {
      parts.push('Empty types');
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'No filters applied';
  }, [filters, countRange, dateOption, showEmpty]);
  
  return (
    <div className="bg-[#0e183d] border border-blue-900/30 rounded-lg shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-blue-900/30">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-medium text-white">Advanced Filters</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-blue-900/20 text-blue-300 border-blue-700/30">
            {filterSummary}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Quick Filters</TabsTrigger>
            <TabsTrigger value="advanced">Conditions</TabsTrigger>
            <TabsTrigger value="ranges">Ranges</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="basic" className="px-4 pb-4 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-blue-300">Quick Filters</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between bg-blue-950/40 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Show Empty Types</span>
                </div>
                <Switch 
                  checked={showEmpty} 
                  onCheckedChange={setShowEmpty} 
                />
              </div>
              
              <div className="flex items-center justify-between bg-blue-950/40 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-white">Show Active Types</span>
                </div>
                <Switch 
                  checked={showActive} 
                  onCheckedChange={setShowActive} 
                />
              </div>
            </div>
            
            <h4 className="text-xs font-medium text-blue-300 pt-2">Date Range</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={dateOption === "anytime" ? "default" : "outline"} 
                size="sm"
                onClick={() => setDateOption("anytime")}
                className={dateOption === "anytime" ? "bg-blue-600" : "border-blue-800/50 text-blue-300"}
              >
                Anytime
              </Button>
              <Button 
                variant={dateOption === "today" ? "default" : "outline"} 
                size="sm"
                onClick={() => setDateOption("today")}
                className={dateOption === "today" ? "bg-blue-600" : "border-blue-800/50 text-blue-300"}
              >
                Today
              </Button>
              <Button 
                variant={dateOption === "lastWeek" ? "default" : "outline"} 
                size="sm"
                onClick={() => setDateOption("lastWeek")}
                className={dateOption === "lastWeek" ? "bg-blue-600" : "border-blue-800/50 text-blue-300"}
              >
                Last 7 days
              </Button>
              <Button 
                variant={dateOption === "lastMonth" ? "default" : "outline"} 
                size="sm"
                onClick={() => setDateOption("lastMonth")}
                className={dateOption === "lastMonth" ? "bg-blue-600" : "border-blue-800/50 text-blue-300"}
              >
                Last 30 days
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="px-4 pb-4 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-blue-300">Current Conditions</h4>
            
            {filters.length === 0 ? (
              <div className="text-center py-3 bg-blue-950/30 rounded-md">
                <p className="text-sm text-blue-400">No conditions added yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filters.map((filter) => (
                  <div key={filter.id} className="flex items-center justify-between bg-blue-950/40 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      {fieldIcons[filter.field as keyof typeof fieldIcons]}
                      <span className="text-sm text-white">
                        {fieldLabels[filter.field as keyof typeof fieldLabels]} {filter.operator} <span className="text-blue-300 font-medium">{String(filter.value)}</span>
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFilter(filter.id)}
                      className="h-7 w-7 p-0 text-blue-400 hover:text-blue-300"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Separator className="my-3 bg-blue-900/20" />
            
            <h4 className="text-xs font-medium text-blue-300">Add Condition</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Select 
                  value={newFilter.field} 
                  onValueChange={handleFieldChange}
                >
                  <SelectTrigger className="bg-blue-900/20 border-blue-800/30 text-xs h-9">
                    <div className="flex items-center gap-1.5">
                      {fieldIcons[newFilter.field as keyof typeof fieldIcons]}
                      <SelectValue placeholder="Field" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(fieldLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        <div className="flex items-center gap-1.5">
                          {fieldIcons[value as keyof typeof fieldIcons]}
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select 
                  value={newFilter.operator} 
                  onValueChange={handleOperatorChange}
                >
                  <SelectTrigger className="bg-blue-900/20 border-blue-800/30 text-xs h-9">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatorsByField(newFilter.field).map(op => (
                      <SelectItem key={op.value} value={op.value} className="text-xs">
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-1">
                {isDateField(newFilter.field) ? (
                  <DateRangePicker 
                    date={newFilter.value as DateRange | undefined}
                    onDateChange={(value) => handleValueChange(value)}
                    className="w-full"
                  />
                ) : isNumberField(newFilter.field) ? (
                  <Input 
                    type="number"
                    placeholder="Enter value"
                    value={newFilter.value as string || ''}
                    onChange={(e) => handleValueChange(parseInt(e.target.value) || 0)}
                    className="bg-blue-900/20 border-blue-800/30 text-white h-9 text-xs"
                  />
                ) : (
                  <Input 
                    placeholder="Enter value"
                    value={newFilter.value as string || ''}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="bg-blue-900/20 border-blue-800/30 text-white h-9 text-xs"
                  />
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addFilter}
                  className="border-blue-800/50 text-blue-300 hover:bg-blue-900/30 h-9 w-9 p-0"
                  disabled={!newFilter.value}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="ranges" className="px-4 pb-4 space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-medium text-blue-300">Document Count Range</h4>
            
            <div className="pt-4 px-2">
              <Slider
                value={countRange}
                min={0}
                max={100}
                step={1}
                onValueChange={setCountRange}
                className="my-6"
              />
              <div className="flex justify-between text-xs text-blue-400">
                <span>Min: {countRange[0]}</span>
                <span>Max: {countRange[1]}</span>
              </div>
            </div>
            
            <h4 className="text-xs font-medium text-blue-300 pt-2">Custom Date Range</h4>
            
            <DateRangePicker 
              date={customDateRange}
              onDateChange={setCustomDateRange}
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-2 p-4 border-t border-blue-900/30 bg-blue-950/30">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearFilters}
          className="border-blue-800/50 text-blue-300 hover:bg-blue-900/30"
        >
          Clear All
        </Button>
        <Button 
          size="sm"
          onClick={handleApplyFilters}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default DocumentTypeFilters;