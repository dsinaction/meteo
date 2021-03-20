import { Card, CardHeader, Divider, CardContent } from '@material-ui/core';

const MeteoCard = ({ children, title, subheader }) => {

    return (
        <Card>
            {!title && !subheader
                ? <></>
                : <>
                    <CardHeader
                        title={title}
                        subheader={subheader}
                    />
                    <Divider />
                </>
            }
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default MeteoCard;