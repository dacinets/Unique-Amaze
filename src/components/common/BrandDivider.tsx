import React from 'react';

export type DividerVariant = 'teal' | 'cyan' | 'slate' | 'gradient' | 'minimal';
export type DividerWidth = 'full' | 'container' | 'narrow' | 'prose';
export type DividerSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface BrandDividerProps {
  variant?: DividerVariant;
  width?: DividerWidth;
  spacing?: DividerSpacing;
  label?: string;
  sublabel?: string;
  showPip?: boolean;
  className?: string;
}

export const BrandDivider: React.FC<BrandDividerProps> = ({
  variant = 'teal',
  width = 'container',
  spacing = 'md',
  label,
  sublabel,
  showPip = true,
  className = '',
}) => {
  // Spacing presets (vertical margin/padding rhythm)
  const spacingClasses: Record<DividerSpacing, string> = {
    none: 'py-0 my-0',
    xs: 'py-4 sm:py-6',
    sm: 'py-8 sm:py-10',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-24',
    xl: 'py-20 sm:py-32',
  };

  // Max-width constraints to align with page grid
  const widthClasses: Record<DividerWidth, string> = {
    full: 'w-full',
    container: 'max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6',
    prose: 'max-w-2xl mx-auto px-4',
  };

  // Hairline gradient colors matching brand palette
  const getGradientLine = () => {
    switch (variant) {
      case 'cyan':
        return 'from-transparent via-[#16D2C8]/40 to-transparent';
      case 'slate':
        return 'from-transparent via-white/10 to-transparent';
      case 'gradient':
        return 'from-transparent via-[#008280]/40 via-[#16D2C8]/50 via-[#367588]/40 to-transparent';
      case 'minimal':
        return 'from-transparent via-white/[0.07] to-transparent';
      case 'teal':
      default:
        return 'from-transparent via-[#008280]/45 to-transparent';
    }
  };

  const getPipColor = () => {
    switch (variant) {
      case 'cyan':
        return 'bg-[#16D2C8] shadow-[0_0_8px_#16D2C8]';
      case 'slate':
        return 'bg-[#94A3B8] shadow-[0_0_6px_rgba(148,163,184,0.5)]';
      case 'gradient':
        return 'bg-[#16D2C8] shadow-[0_0_10px_#16D2C8]';
      case 'minimal':
        return 'bg-white/30';
      case 'teal':
      default:
        return 'bg-[#008280] shadow-[0_0_8px_#008280]';
    }
  };

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={`relative z-10 w-full flex items-center justify-center select-none ${spacingClasses[spacing]} ${className}`}
    >
      <div className={`relative w-full ${widthClasses[width]}`}>
        {/* Subtle Horizontal Hairline with Specular Center */}
        <div className="relative flex items-center justify-center">
          {/* Base gradient hairline */}
          <div
            className={`h-[1px] w-full bg-gradient-to-r ${getGradientLine()} transition-opacity duration-500`}
          />

          {/* Optional Label / Technical Index Badge */}
          {label ? (
            <div className="brand-divider-badge absolute flex items-center gap-2 px-3 py-0.5 rounded-full border border-white/10 bg-[#06080B]/90 backdrop-blur-md font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#94A3B8] shadow-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${getPipColor()} animate-pulse`} />
              <span className="font-semibold text-[#CBD5E1]">{label}</span>
              {sublabel && (
                <>
                  <span className="text-white/20">//</span>
                  <span className="text-[#16D2C8]">{sublabel}</span>
                </>
              )}
            </div>
          ) : showPip ? (
            /* Micro Brand Pip / Diamond Centerpiece */
            <div className="absolute flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Subtle diamond accent glow */}
                <div
                  className={`h-1.5 w-1.5 rotate-45 rounded-[1px] ${getPipColor()}`}
                />
                <div className="absolute -inset-1 rounded-full bg-white/[0.04] blur-[1px]" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
