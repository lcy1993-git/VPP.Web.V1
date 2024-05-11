const ContainerPage = ({ children, paddingTop = '16px' }: any) => {
  return <div style={{ width: '100%', height: '98%', paddingTop: paddingTop }}>{children}</div>;
};
export default ContainerPage;
