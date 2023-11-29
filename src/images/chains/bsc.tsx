import type { IconProps } from '../../icons/props';

const Icon = ({ height = 23, width = 20, color = '#f3ba2f', className }: IconProps) => {
  return (
    <svg width={width} height={height} className={className} viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="512" cy="512" r="512" fill={color} />
      <path fill="#fff" d="M404.9 468L512 360.9l107.1 107.2 62.3-62.3L512 236.3 342.6 405.7z" />
      <path transform="rotate(-45.001 298.629 511.998)" fill="#fff" d="M254.6 467.9h88.1V556h-88.1z" />
      <path fill="#fff" d="M404.9 556L512 663.1l107.1-107.2 62.4 62.3h-.1L512 787.7 342.6 618.3l-.1-.1z" />
      <path transform="rotate(-45.001 725.364 512.032)" fill="#fff" d="M681.3 468h88.1v88.1h-88.1z" />
      <path fill="#fff" d="M575.2 512L512 448.7l-46.7 46.8-5.4 5.3-11.1 11.1-.1.1.1.1 63.2 63.2 63.2-63.3z" />
    </svg>
  );
};

export default Icon;
