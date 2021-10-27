import React from 'react';

interface IProps {
  name: string;
  enthusiasmLevel?: number;
}

const Index: React.FC<IProps> = (props) => {
  const { name, enthusiasmLevel = 1 } = props;

  if (enthusiasmLevel <= 0) {
    throw new Error('You could be a little more enthusiastic. :D');
  }

  const getExclamationMarks = (numChars: number) => Array(numChars + 1).join('!');

  return (
    <div className="hello">
      <div className="greeting">
        Hello
        {' '}
        {name + getExclamationMarks(enthusiasmLevel)}
      </div>
    </div>
  );
};

Index.defaultProps = { enthusiasmLevel: 1 };

export default Index;
