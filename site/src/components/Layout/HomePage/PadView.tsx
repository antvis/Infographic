import {ReactNode, useEffect, useState} from 'react';

interface PadViewProps {
  children: ReactNode;
  minHeight?: number | string;
  minWidth?: number | string;
  width?: number | string;
  height?: number | string;
}

export function PadView({
  children,
  minHeight,
  minWidth,
  width,
  height,
}: PadViewProps) {
  const contentStyle: React.CSSProperties = {};
  if (minHeight) contentStyle.minHeight = minHeight;
  if (minWidth) contentStyle.minWidth = minWidth;
  if (width) contentStyle.width = width;
  if (height) contentStyle.height = height;

  return (
    <figure
      className="mx-auto w-full h-auto"
      style={width ? {maxWidth: width} : {maxWidth: '80rem'}}>
      <div className="p-3 lg:p-4 bg-gray-95 dark:bg-black rounded-2xl shadow-nav dark:shadow-nav-dark transition-colors duration-500">
        <div
          className="bg-gradient-right dark:bg-gradient-right-dark px-4 sm:px-6 lg:px-8 pb-16 lg:pb-12 rounded-lg overflow-hidden transition-colors duration-500"
          style={
            Object.keys(contentStyle).length > 0 ? contentStyle : undefined
          }>
          <div className="select-none w-full h-14 flex flex-row items-start pt-3 -mb-2.5 justify-between text-tertiary dark:text-tertiary-dark transition-colors duration-500">
            <span className="uppercase tracking-wide leading-none font-bold text-sm text-tertiary dark:text-tertiary-dark">
              <CurrentTime />
            </span>
            <div className="gap-2 flex -mt-0.5">
              <svg
                width="16"
                height="20"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M34.852 6.22836C35.973 5.76401 37.2634 6.02068 38.1214 6.87868L53.1214 21.8787C53.7485 22.5058 54.066 23.3782 53.9886 24.2617C53.9113 25.1451 53.447 25.9491 52.7205 26.4577L39.0886 36.0003L52.7204 45.5423C53.447 46.0508 53.9113 46.8548 53.9886 47.7383C54.066 48.6218 53.7485 49.4942 53.1214 50.1213L38.1214 65.1213C37.2634 65.9793 35.973 66.236 34.852 65.7716C33.731 65.3073 33.0001 64.2134 33.0001 63V40.2624L22.7205 47.4583C21.3632 48.4085 19.4926 48.0784 18.5424 46.721C17.5922 45.3637 17.9223 43.4931 19.2797 42.543L28.6258 36.0004L19.2797 29.4583C17.9224 28.5082 17.5922 26.6376 18.5424 25.2803C19.4925 23.9229 21.3631 23.5928 22.7204 24.5429L33.0001 31.7384V9C33.0001 7.78661 33.731 6.6927 34.852 6.22836ZM39.0001 43.2622L46.3503 48.4072L39.0001 55.7574V43.2622ZM39.0001 28.7382V16.2426L46.3503 23.5929L39.0001 28.7382Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                width="16"
                height="20"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 27C9.82864 27 10.5788 26.664 11.1217 26.1209C11.2116 26.0355 11.3037 25.9526 11.397 25.871C11.625 25.6714 11.9885 25.3677 12.4871 24.9938C13.4847 24.2455 15.0197 23.219 17.0912 22.1833C21.2243 20.1167 27.5179 18 35.9996 18C44.4813 18 50.7748 20.1167 54.9079 22.1833C56.9794 23.219 58.5144 24.2455 59.5121 24.9938C59.6056 25.0639 60.8802 26.1233 60.8802 26.1233C61.423 26.6652 62.1724 27 63 27C64.6569 27 66 25.6569 66 24C66 22.8871 65.3475 22.0506 64.5532 21.3556C64.2188 21.0629 63.7385 20.6635 63.1121 20.1938C61.8597 19.2545 60.0197 18.031 57.5912 16.8167C52.7243 14.3833 45.5179 12 35.9996 12C26.4813 12 19.2748 14.3833 14.4079 16.8167C11.9794 18.031 10.1394 19.2545 8.88706 20.1938C8.26066 20.6635 7.78035 21.0629 7.44593 21.3556C7.2605 21.5178 7.07794 21.6834 6.9016 21.8555C6.33334 22.417 6 23.1999 6 24C6 25.6569 7.34315 27 9 27Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.1116 48.631C24.2868 50.4378 21 49.0661 21 46.5C21 45.6707 21.3365 44.92 21.8804 44.3769C21.9856 44.2702 22.0973 44.1695 22.209 44.0697C22.3915 43.9065 22.6466 43.6885 22.9713 43.4344C23.6195 42.9271 24.5536 42.2694 25.7509 41.6163C28.1445 40.3107 31.6365 39 35.9999 39C40.3634 39 43.8554 40.3107 46.249 41.6163C47.4463 42.2694 48.3804 42.9271 49.0286 43.4344C50.0234 44.213 51 45.134 51 46.5C51 48.1569 49.6569 49.5 48 49.5C47.1724 49.5 46.4231 49.1649 45.8803 48.623C45.7028 48.4617 45.5197 48.3073 45.3307 48.1594C44.9007 47.8229 44.2411 47.3556 43.3759 46.8837C41.6445 45.9393 39.1365 45 35.9999 45C32.8634 45 30.3554 45.9393 28.624 46.8837C27.7588 47.3556 27.0992 47.8229 26.6692 48.1594C26.3479 48.4109 26.155 48.5899 26.1116 48.631Z"
                  fill="currentColor"
                />
                <path
                  d="M36 63C39.3137 63 42 60.3137 42 57C42 53.6863 39.3137 51 36 51C32.6863 51 30 53.6863 30 57C30 60.3137 32.6863 63 36 63Z"
                  fill="currentColor"
                />
                <path
                  d="M15 39C13.3431 39 12 37.6569 12 36C12 34.3892 13.3933 33.3427 14.5534 32.4503C15.5841 31.6574 17.0871 30.6231 19.04 29.5952C22.9506 27.537 28.6773 25.5 35.9997 25.5C43.3222 25.5 49.0488 27.537 52.9595 29.5952C54.9123 30.6231 56.4154 31.6574 57.4461 32.4503C57.9619 32.847 58.361 33.1846 58.6407 33.4324C59.4024 34.1073 60 34.9345 60 36C60 37.6569 58.6569 39 57 39C56.1737 39 55.4255 38.6662 54.8829 38.1258C54.5371 37.7978 54.1653 37.4964 53.7878 37.206C52.9903 36.5926 51.7746 35.7519 50.165 34.9048C46.9506 33.213 42.1773 31.5 35.9997 31.5C29.8222 31.5 25.0488 33.213 21.8345 34.9048C20.2248 35.7519 19.0091 36.5926 18.2117 37.206C17.6144 37.6654 17.2549 37.9951 17.1459 38.098C16.5581 38.6591 15.8222 39 15 39Z"
                  fill="currentColor"
                />
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.9533 26.0038C13.224 24.7829 14.3285 24 15.579 24H50.421C51.6715 24 52.776 24.7829 53.0467 26.0038C53.4754 27.937 54 31.2691 54 36C54 40.7309 53.4754 44.063 53.0467 45.9962C52.776 47.2171 51.6715 48 50.421 48H15.579C14.3285 48 13.224 47.2171 12.9533 45.9962C12.5246 44.063 12 40.7309 12 36C12 31.2691 12.5246 27.937 12.9533 26.0038Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7887 15C8.77039 15 5.23956 17.668 4.48986 21.6158C3.74326 25.5473 3 30.7737 3 36C3 41.2263 3.74326 46.4527 4.48986 50.3842C5.23956 54.332 8.77039 57 12.7887 57H53.2113C57.2296 57 60.7604 54.332 61.5101 50.3842C61.8155 48.7765 62.1202 46.9522 62.3738 45H63.7918C64.5731 45 65.3283 44.8443 66 44.5491C67.2821 43.9857 68.2596 42.9142 68.5322 41.448C68.7927 40.0466 69 38.2306 69 36C69 33.7694 68.7927 31.9534 68.5322 30.552C68.2596 29.0858 67.2821 28.0143 66 27.4509C65.3283 27.1557 64.5731 27 63.7918 27H62.3738C62.1202 25.0478 61.8155 23.2235 61.5101 21.6158C60.7604 17.668 57.2296 15 53.2113 15H12.7887ZM53.2113 21H12.7887C11.3764 21 10.5466 21.8816 10.3845 22.7352C9.67563 26.4681 9 31.29 9 36C9 40.71 9.67563 45.5319 10.3845 49.2648C10.5466 50.1184 11.3764 51 12.7887 51H53.2113C54.6236 51 55.4534 50.1184 55.6155 49.2648C56.3244 45.5319 57 40.71 57 36C57 31.29 56.3244 26.4681 55.6155 22.7352C55.4534 21.8816 54.6236 21 53.2113 21Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center pt-0 gap-3 px-2.5 lg:pt-8 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </figure>
  );
}

function CurrentTime() {
  const [date, setDate] = useState(new Date());
  const currentTime = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
  });
  useEffect(() => {
    const msPerMinute = 60 * 1000;
    let nextMinute = Math.floor(+date / msPerMinute + 1) * msPerMinute;

    const timeout = setTimeout(() => {
      if (Date.now() > nextMinute) {
        setDate(new Date());
      }
    }, nextMinute - Date.now());
    return () => clearTimeout(timeout);
  }, [date]);

  return <span suppressHydrationWarning>{currentTime}</span>;
}
