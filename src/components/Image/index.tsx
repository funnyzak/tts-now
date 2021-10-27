import React, { CSSProperties } from 'react';

interface IProps {
  src: string;
  styleSet?: CSSProperties | undefined;
}

const Index: React.FC<IProps> = (props) => {
  const { src, styleSet } = props;

  return <img src={src} style={styleSet} alt="img" />;
};

Index.defaultProps = {
  styleSet: { width: '64px', height: 'auto' }
};

export default Index;
