import React from 'react';
import { gradient, useThemeContext } from '@aave/aave-ui-kit';

interface GradientLineProps {
  height?: number;
}

export default function GradientLine({ height }: GradientLineProps) {
  const { currentTheme } = useThemeContext();

  const gradientBackground = gradient(
    90,
    `${currentTheme.secondary.rgb}, 1`,
    0,
    `${currentTheme.primary.rgb}, 1`,
    100
  );

  return (
    <span className="GradientLine">
      <style jsx={true}>{`
        .GradientLine {
          width: 100%;
          height: ${height || 1}px;
          display: block;
          background: linear-gradient(to right,#B5DCF7,#7AB3DA,#2C79AC,#124E78);
        }
      `}</style>
    </span>
  );
}
