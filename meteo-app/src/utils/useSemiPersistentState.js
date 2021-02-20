import React from 'react';

export default (key, initialState) => {
    const isMounted = React.useRef(false);
    const [value, setValue] = React.useState(
        JSON.parse(localStorage.getItem(key)) || initialState
    );

    React.useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
        } else {
            console.log('A');
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [value, key]);
    
    return [value, setValue];
};