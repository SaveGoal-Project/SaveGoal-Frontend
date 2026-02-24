'use client';

import { Slider } from '@/src/components/ui/slider';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';

interface FilterState {
    priceRange: [number, number];
    categories: string[];
    merchants: string[];
}

interface ProductFiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    minPrice: number;
    maxPrice: number;
    categories: string[];
    merchants: string[];
    className?: string;
}

export function ProductFilters({
    filters,
    setFilters,
    minPrice,
    maxPrice,
    categories,
    merchants,
    className,
}: ProductFiltersProps) {
    const handleCategoryChange = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category];
        setFilters({ ...filters, categories: newCategories });
    };

    const handleMerchantChange = (merchant: string) => {
        const newMerchants = filters.merchants.includes(merchant)
            ? filters.merchants.filter((m) => m !== merchant)
            : [...filters.merchants, merchant];
        setFilters({ ...filters, merchants: newMerchants });
    };

    const clearFilters = () => {
        setFilters({
            priceRange: [minPrice, maxPrice],
            categories: [],
            merchants: [],
        });
    };

    return (
        <div className={`space-y-8 ${className}`}>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Filters</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-slate-500 hover:text-blue-600 px-0 h-auto font-normal"
                    >
                        Clear all
                    </Button>
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-900">Price Range</h4>
                <Slider
                    defaultValue={[minPrice, maxPrice]}
                    value={filters.priceRange}
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                />
                <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>GH¢{filters.priceRange[0]}</span>
                    <span>GH¢{filters.priceRange[1]}</span>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-900">Categories</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category}`}
                                checked={filters.categories.includes(category)}
                                onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label
                                htmlFor={`category-${category}`}
                                className="text-sm text-slate-600 cursor-pointer font-normal"
                            >
                                {category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Merchants */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-slate-900">Merchants</h4>
                <div className="space-y-2">
                    {merchants.map((merchant) => (
                        <div key={merchant} className="flex items-center space-x-2">
                            <Checkbox
                                id={`merchant-${merchant}`}
                                checked={filters.merchants.includes(merchant)}
                                onCheckedChange={() => handleMerchantChange(merchant)}
                            />
                            <Label
                                htmlFor={`merchant-${merchant}`}
                                className="text-sm text-slate-600 cursor-pointer font-normal"
                            >
                                {merchant}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
