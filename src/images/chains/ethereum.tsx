import type { IconProps } from '../../icons/props';

const Icon = ({ height = 23, width = 20, color = '#231F20', className }: IconProps) => {
  return (
    <svg width={width} height={height} className={className} viewBox="0 0 226.777 226.777" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M112.553 157V86.977l-68.395 29.96zm0-74.837V-.056L46.362 111.156zM116.962-.09v82.253l67.121 29.403zm0 87.067v70.025l68.443-40.045zm-4.409 140.429v-56.321L44.618 131.31zm4.409 0l67.935-96.096-67.935 39.775z"
        fill={color}
      />
    </svg>
  );
};

export default Icon;
