import BasicLayout, { BasicLayoutProps } from "./BasicLayout";


const AddUpateLayout: React.FC<BasicLayoutProps> = (props) => {
    return <BasicLayout  {...props} hideMenu={false} contentWidth="Fixed" />
}

export default AddUpateLayout;