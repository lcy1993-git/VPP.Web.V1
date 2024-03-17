const ContainerPage = ({ children }: any) => {
  return <div
    style={{ width: "100%", height: 'calc(100vh - 100px)', paddingTop: '16px' }}
  >{children}</div>
}
export default ContainerPage
