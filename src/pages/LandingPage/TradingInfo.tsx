import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { StakeQuickModal } from 'components';
import { useLairInfo, useTotalRewardsDistributed } from 'state/stake/hooks';
import { formatCompact, useLairDQUICKAPY } from 'utils';

export const TradingInfo: React.FC<{ globalData: any }> = ({ globalData }) => {
  const lairInfo = useLairInfo();
  const [openStakeModal, setOpenStakeModal] = useState(false);

  const dQUICKAPY = useLairDQUICKAPY(lairInfo);

  const totalRewardsUSD = useTotalRewardsDistributed();

  return (
    <>
      {openStakeModal && (
        <StakeQuickModal
          open={openStakeModal}
          onClose={() => setOpenStakeModal(false)}
        />
      )}
      <Box className='tradingSection'>
        {globalData ? (
          <h3>{Number(globalData.oneDayTxns).toLocaleString()}</h3>
        ) : (
          <Skeleton variant='rect' width={100} height={45} />
        )}
        <p>24H TRANSACTIONS</p>
      </Box>
      <Box className='tradingSection'>
        {globalData ? (
          <Box display='flex'>
            <h6>$</h6>
            <h3>{formatCompact(globalData.oneDayVolumeUSD)}</h3>
          </Box>
        ) : (
          <Skeleton variant='rect' width={100} height={45} />
        )}
        <p>24H TRADING VOLUME</p>
      </Box>
      <Box className='tradingSection'>
        {totalRewardsUSD ? (
          <Box display='flex'>
            <h6>$</h6>
            <h3>{totalRewardsUSD.toLocaleString()}</h3>
          </Box>
        ) : (
          <Skeleton variant='rect' width={100} height={45} />
        )}
        <p>24h REWARDS DISTRIBUTED</p>
      </Box>
      <Box className='tradingSection'>
        {globalData ? (
          <h3>
            {Number(globalData.pairCount).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </h3>
        ) : (
          <Skeleton variant='rect' width={100} height={45} />
        )}
        <p>TOTAL TRADING PAIRS</p>
      </Box>
      <Box className='tradingSection' pt='20px'>
        {dQUICKAPY ? (
          <h3>{dQUICKAPY.toLocaleString()}%</h3>
        ) : (
          <Skeleton variant='rect' width={100} height={45} />
        )}
        <p>dQUICK APY</p>
        <h4 onClick={() => setOpenStakeModal(true)}>stake {'>'}</h4>
      </Box>
    </>
  );
};
