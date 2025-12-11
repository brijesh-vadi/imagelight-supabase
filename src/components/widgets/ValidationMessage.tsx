const ValidationMessage = ({ message }: { message: string }) => {
  return <span className="text-destructive text-xs">{message}</span>;
};

export default ValidationMessage;
