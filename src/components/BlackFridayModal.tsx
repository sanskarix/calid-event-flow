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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">BLACK FRIDAY EXCLUSIVE</span>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                2 Years
                <span className="block text-primary mt-2">Completely Free</span>
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                Unlock premium features, unlimited bookings, and advanced integrations at zero cost
              </p>
            </div>

            {/* Features highlight */}
            <div className="flex flex-wrap justify-center gap-4 py-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">No credit card</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Full access</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 border border-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Limited time</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                onClick={() => {
                  onClaim();
                  onOpenChange(false);
                }}
                className="w-full md:w-auto h-16 px-12 text-lg font-bold shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
              >
                Claim Your 2 Years Free
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Offer expires soon • Limited spots available
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlackFridayModal;
