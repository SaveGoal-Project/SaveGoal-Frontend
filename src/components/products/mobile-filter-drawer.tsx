'use client';

import { X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ProductFilters } from './product-filters';
import { useEffect } from 'react';

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFilters: any;
    minPrice: number;
    maxPrice: number;
    categories: string[];
    merchants: string[];
}

export function MobileFilterDrawer({
    isOpen,
    onClose,
    filters,
    setFilters,
    minPrice,
    maxPrice,
    categories,
    merchants,
}: MobileFilterDrawerProps) {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            console.log("closed")
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl animate-in slide-in-from-right duration-300">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="font-semibold text-lg">Filters</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <ProductFilters
                            filters={filters}
                            setFilters={setFilters}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            categories={categories}
                            merchants={merchants}
                        />
                    </div>

                    <div className="p-4 border-t bg-slate-50">
                        <Button className="w-full bg-slate-900 text-white" onClick={onClose}>
                            Show Results
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
