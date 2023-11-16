import type { IconProps } from '../../icons/props';

const Icon = ({ height = 23, width = 20, color = '#0075BD', className }: IconProps) => {
  return (
    <svg width={width} height={height} className={className} viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.78 17.052a3.377 3.377 0 01-1.707 2.934l-7.989 4.565a3.418 3.418 0 01-3.387 0l-7.989-4.565a3.393 3.393 0 01-1.25-1.239A3.37 3.37 0 010 17.052V7.947a3.372 3.372 0 011.705-2.931L9.695.448a3.423 3.423 0 013.388 0l7.989 4.568a3.368 3.368 0 011.708 2.931v9.105z"
        fill={color}
      />
      <path
        d="M10.404 1.72L2.517 6.25a1.969 1.969 0 00-.986 1.701l.004 9.072a1.953 1.953 0 00.987 1.697l7.896 4.54a1.98 1.98 0 001.972 0l7.888-4.53a1.968 1.968 0 00.987-1.699l-.007-9.073a1.951 1.951 0 00-.984-1.696l-7.898-4.541a1.98 1.98 0 00-1.972 0V1.72z"
        fill="#fff"
      />
      <path
        d="M7.801 20.195a.372.372 0 01.077-.16l7.08-11.947c.033-.055.063-.112.09-.162-.02-.035-.044-.029-.064-.029-1.009 0-2.017.01-3.026.01a.211.211 0 00-.197.133l-2.287 3.752-4.846 7.954a.71.71 0 00-.042.07c-.03.054-.061.064-.119.03-.254-.147-.508-.29-.771-.442l7.19-11.472c-.015-.046-.046-.035-.072-.036-.384-.011-.77-.027-1.156-.03a4.289 4.289 0 00-1.589.252 2.24 2.24 0 00-1.118.906 1446.988 1446.988 0 01-3.957 6.105c-.02.032-.042.063-.064.095-.076 0-.064-.061-.071-.105a1.257 1.257 0 01-.004-.197c0-2.248.008-4.495-.007-6.743a.964.964 0 01.558-.936c1.736-.985 3.462-1.99 5.194-2.985.773-.444 1.552-.884 2.314-1.335a.88.88 0 01.976 0c1.412.823 2.836 1.628 4.254 2.442 1.07.613 2.14 1.224 3.21 1.835.077.044.151.09.228.133a.741.741 0 01.393.694v7.334a.449.449 0 01-.02.178c-.084.085-.114-.01-.146-.053-.128-.18-.241-.367-.36-.551-.948-1.477-1.9-2.952-2.856-4.426-.321-.498-.646-.994-.964-1.494-.073-.117-.085-.118-.16.007l-1.44 2.419a.244.244 0 00.028.287c.396.633.79 1.267 1.186 1.902l2.015 3.243.817 1.313a.329.329 0 01.085.21c-.055.108-.17.139-.263.187a1.98 1.98 0 01-.508.264c-.098-.024-.132-.111-.179-.184-.624-.968-1.24-1.937-1.863-2.911-.637-.998-1.27-2-1.913-2.996-.084-.128-.094-.128-.17 0-.556.933-1.105 1.87-1.664 2.8a.245.245 0 00.014.29c.752 1.153 1.486 2.316 2.23 3.475.208.324.418.646.622.971.039.064.094.127.057.212a3.476 3.476 0 01-.628.388c-.696.403-1.391.805-2.088 1.205a.69.69 0 01-.747 0 756.447 756.447 0 00-3.08-1.76.403.403 0 01-.177-.138"
        fill="#202A3B"
      />
      <path
        d="M19.928 15.558c0-.06.004-.12.004-.181V8.06a.755.755 0 00-.418-.724 2583.96 2583.96 0 01-7.718-4.415.72.72 0 00-.778 0 1691.03 1691.03 0 01-4.29 2.469c-1.148.66-2.295 1.322-3.441 1.984a.715.715 0 00-.386.674c.006 2.34.009 4.681.01 7.021 0 .052-.02.11.025.156-.273.45-.57.883-.858 1.324l-.432.662c-.023.034-.05.067-.095.13 0-.074-.007-.115-.007-.156v-9.26a1.859 1.859 0 01.98-1.68c1-.589 2.012-1.157 3.017-1.736.847-.488 1.693-.98 2.54-1.47.791-.456 1.573-.927 2.377-1.358a1.976 1.976 0 012.002.052c.646.365 1.29.736 1.934 1.105l1.817 1.04 1.676.96 1.659.946c.243.14.487.278.729.421a2.042 2.042 0 011.012 1.447c.01.088.014.176.01.264v9.11a1.95 1.95 0 01-.708 1.517c-.127.096-.263.18-.407.248-.828.48-1.656.957-2.486 1.432L15.05 21.74c-.847.488-1.694.977-2.54 1.47-.211.14-.448.237-.697.286-.414.08-.843.026-1.223-.155-.424-.226-.834-.47-1.25-.707a409.47 409.47 0 01-1.674-.959l-.474-.268c-.058-.032-.098-.067-.053-.14.208-.349.414-.7.621-1.048.009-.013.027-.018.041-.028.194.09.38.192.56.307.912.519 1.823 1.04 2.732 1.563a.647.647 0 00.7-.008c.862-.506 1.73-1 2.596-1.499.042-.024.084-.047.13-.07a.714.714 0 01.315-.229c.782-.445 1.557-.9 2.339-1.347.065-.038.124-.094.21-.085l.761-.44c.048-.099.147-.13.23-.178.386-.22.769-.449 1.157-.663a.659.659 0 00.354-.614v-1.165a.289.289 0 01.04-.206"
        fill="#81B2D4"
      />
      <path
        d="M19.928 15.557c0 .482.012.965 0 1.446a.611.611 0 01-.321.553c-.488.274-.967.564-1.459.831-.195-.354-.423-.692-.635-1.038-1.11-1.79-2.222-3.58-3.335-5.368-.066-.108-.127-.22-.202-.32a.16.16 0 010-.207c.266-.442.528-.886.79-1.33l.73-1.231a.133.133 0 01.065-.067l.383.59a7643.365 7643.365 0 013.865 5.988.51.51 0 00.119.157m-2.544 3.267c-.317.208-.653.383-.98.576-.593.347-1.185.687-1.783 1.028l-.102.057a.266.266 0 00-.068-.147l-1.588-2.482c-.435-.68-.871-1.359-1.309-2.037a.208.208 0 01-.013-.252c.587-.98 1.17-1.963 1.748-2.948.014-.023.026-.05.06-.057.048.01.059.057.085.092 1.052 1.655 2.104 3.308 3.157 4.96.225.35.448.703.678 1.054a.476.476 0 00.115.156z"
        fill="#258BCD"
      />
    </svg>
  );
};

export default Icon;
