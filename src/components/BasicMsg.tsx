import * as React from 'react';

export interface BasicMsgProps {
  msg: string;
}

const BasicMsg: React.FC<BasicMsgProps> = (props) => {
  const { msg } = props;

  return <div className="text-center mb">{msg}</div>;
};

export { BasicMsg };
