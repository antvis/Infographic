import {motion, useInView} from 'framer-motion';
import Image from 'next/image';
import {useRef} from 'react';

export function AIInfographicFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {once: true, margin: '-100px'});

  const imgProps = {
    src: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*NQfsRok_qYoAAAAAXQAAAAgAemJ7AQ/original.svg',
    alt: 'AI 生成信息图流程：从用户文本输入，经过智能推荐、信息抽取、生成配置，最终渲染出专业信息图',
    width: 600,
    height: 360,
    priority: true,
    draggable: false,
  } as const;

  return (
    <motion.div
      ref={containerRef}
      className="w-full py-8 flex items-center justify-center"
      initial={{opacity: 0, y: 40}}
      animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 40}}
      transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}>
      <div className="w-full max-w-3xl mx-auto px-4">
        <Image
          {...imgProps}
          src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*NQfsRok_qYoAAAAAXQAAAAgAemJ7AQ/original.svg"
          className="w-full h-auto select-none block dark:hidden"
        />
        <Image
          {...imgProps}
          src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*4KcXS5qkNEkAAAAAXWAAAAgAemJ7AQ/original.svg"
          className="w-full h-auto select-none hidden dark:block"
        />
      </div>
    </motion.div>
  );
}
