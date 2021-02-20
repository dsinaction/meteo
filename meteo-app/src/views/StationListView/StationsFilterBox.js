import React from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, InputAdornment, SvgIcon } from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';

const StationsFilterBox = ({ searchTerm, onSearch, ...rest }) => {
    const { t } = useTranslation();

    return (
        <Box maxWidth={500}>
            <TextField
                fullWidth
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SvgIcon
                                fontSize="small"
                                color="action"
                            >
                                <SearchIcon />
                            </SvgIcon>
                        </InputAdornment>
                    )
                }}
                placeholder={t('Search')}
                variant="outlined"
                onChange={onSearch}
                value={searchTerm}
            />
        </Box>
    );
};

StationsFilterBox.propTypes = {
    className: PropTypes.string
};

export default StationsFilterBox;
