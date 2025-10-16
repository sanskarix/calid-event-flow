import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Zap } from 'lucide-react';

interface BlackFridayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaim: () => void;
}

const BlackFridayModal = ({ open, onOpenChange, onClaim }: BlackFridayModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 border-0 bg-transparent shadow-none">
        <div className="relative bg-gradient-to-br from-background via-background to-muted/30 rounded-2xl border-2 border-primary/20 shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse" />

          {/* Content */}
          <div className="relative px-8 py-12 md:px-16 md:py-16 text-center space-y-8">
            {/* BLACK FRIDAY Badge - More Prominent */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive/10 border-2 border-destructive/30 animate-pulse">
                <Zap className="w-5 h-5 text-destructive fill-destructive" />
                <span className="text-base md:text-lg font-bold text-destructive tracking-wider">BLACK FRIDAY EXCLUSIVE</span>
                <Zap className="w-5 h-5 text-destructive fill-destructive" />
              </div>
              <p className="text-sm md:text-base font-semibold text-destructive animate-pulse">
                ⏰ Ends in 24 hours • Only 47 spots left
              </p>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                2 Years Pro
                <span className="block text-primary mt-2">100% Free</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                Unlock premium features, unlimited bookings, and advanced integrations at zero cost
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => {
                  onClaim();
                  onOpenChange(false);
                }}
                className="w-full md:w-auto h-16 px-12 text-lg font-bold shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105 animate-pulse"
              >
                Claim Your 2 Years Free Now
              </Button>
              <p className="text-xs text-destructive font-semibold mt-4">
                ⚡ This offer won't last • Claim before it's gone
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlackFridayModal;
