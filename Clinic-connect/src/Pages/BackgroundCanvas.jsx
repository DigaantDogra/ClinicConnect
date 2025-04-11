
export const BackgroundCanvas = ({ section }) => {
    return <>
        <div className="bg-white h-200 w-410 rounded-2xl">
        <div className="h-23 bg-gradient-to-r from-blue-200 to-yellow-100 rounded-t-2xl"/>
            {section}
        </div>
    </>
}