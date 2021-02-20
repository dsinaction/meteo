import React from 'react';
import Select from 'react-select'
import { useTranslation } from 'react-i18next';
import Station from './../../services/api/Station';


const optionsReducer = (state, action) => {
    switch (action.type) {
        case 'OPTIONS_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false
            };
        case 'OPTIONS_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            };
        case 'OPTIONS_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
                data: []
            }
        default:
            throw new Error();
    }
};


const StationSelect = ({ onChangeStation, defaultValue }) => {
    const { t } = useTranslation();

    const [options, dispatchOptions] = React.useReducer(
        optionsReducer,
        { data: [], isLoading: false, isError: false }
    );

    React.useEffect(() => {
        dispatchOptions({ type: 'OPTIONS_FETCH_INIT' });
        Station.getAll()
            .then(result => {
                dispatchOptions({
                    type: 'OPTIONS_FETCH_SUCCESS',
                    payload: result.data.data.map(record => ({
                        value: record.id,
                        label: record.name
                    }))
                });
            })
            .catch(() => {
                dispatchOptions({ type: 'OPTIONS_FETCH_FAILURE' });
            });
    }, []);

    return (
        <Select
            options={options.data}
            placeholder={t('Select Station')}
            loadingMessage={() => t('Loading Stations')}
            isLoading={options.isLoading}
            isSearchable={true}
            noOptionsMessage={() => {
                if (options.isError) {
                    return t('Stations Loading Error');
                } else {
                    return t('Lack of Stations');
                }
            }}
            onChange={onChangeStation}
            defaultValue={defaultValue}
        />
    );
};

export default StationSelect;