const ContainerPage = ({ children, paddingTop = '16px' }: any) => {
  return <div
    style={{ width: "100%", height: 'calc(100vh - 100px)', paddingTop: paddingTop }}
  >{children}</div>
}
export default ContainerPage
