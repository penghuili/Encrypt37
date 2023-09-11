import { Box, Button, Layer, Select, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React, { useMemo, useState } from 'react';

import HorizontalCenter from '../shared/react-pure/HorizontalCenter';
import Spacer from '../shared/react-pure/Spacer';

function YearMonthPicker({ onChange, startDate, endDate = new Date() }) {
  const [show, setShow] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const years = useMemo(() => {
    const ys = [];
    const endDateYear = endDate.getFullYear();
    const startDateYear = startDate.getFullYear();
    for (let year = endDateYear; year >= startDateYear; year--) {
      ys.push(year.toString());
    }

    return ys;
  }, [startDate, endDate]);
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  function handleClose() {
    setShow(false);
    onChange('');
  }

  return (
    <>
      <HorizontalCenter>
        <Text onClick={() => setShow(true)} margin="0 1rem 0 0">
          {year && month ? `${year}-${month}` : 'Filter by month'}
        </Text>
        {!!year && !!month && (
          <Close
            onClick={() => {
              setYear('');
              setMonth('');
              onChange('');
            }}
          />
        )}
      </HorizontalCenter>

      {show && (
        <Layer onClickOutside={handleClose} onEsc={handleClose}>
          <Box pad="1rem">
            <HorizontalCenter>
              <Box>
                <Text>Year</Text>
                <Select
                  options={years}
                  value={year}
                  onChange={({ option }) => setYear(option)}
                  width="6rem"
                />
              </Box>
              <Box>
                <Text>Month</Text>
                <Select
                  options={months}
                  value={month}
                  onChange={({ option }) => setMonth(option)}
                  width="6rem"
                />
              </Box>
            </HorizontalCenter>
            <Spacer />
            <Box direction="row" justify="between">
              <Button label="Cancel" onClick={handleClose} />
              <Button
                label="Ok"
                onClick={() => {
                  onChange(`${year}-${month}`);
                  setShow(false);
                }}
                primary
              />
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
}

export default YearMonthPicker;
