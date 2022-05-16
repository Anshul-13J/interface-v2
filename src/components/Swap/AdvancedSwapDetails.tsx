import { Trade, TradeType } from '@uniswap/sdk';
import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Field } from 'state/swap/actions';
import { useUserSlippageTolerance } from 'state/user/hooks';
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
} from 'utils/prices';
import {
  QuestionHelper,
  FormattedPriceImpact,
  CurrencyLogo,
  SettingsModal,
} from 'components';
import { ReactComponent as EditIcon } from 'assets/images/EditIcon.svg';
import { formatTokenAmount } from 'utils';

interface TradeSummaryProps {
  trade: Trade;
  allowedSlippage: number;
}

export const TradeSummary: React.FC<TradeSummaryProps> = ({
  trade,
  allowedSlippage,
}) => {
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const { palette } = useTheme();
  const { t } = useTranslation();

  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(
    trade,
  );
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage,
  );
  const tradeAmount = isExactIn ? trade.outputAmount : trade.inputAmount;

  return (
    <Box mt={1.5}>
      {openSettingsModal && (
        <SettingsModal
          open={openSettingsModal}
          onClose={() => setOpenSettingsModal(false)}
        />
      )}
      <Box className='summaryRow'>
        <Box display='flex' alignItems='center'>
          <small>Slippage:</small>
          <QuestionHelper text={t('slippageHelper')} />
        </Box>
        <Box
          display='flex'
          alignItems='center'
          onClick={() => setOpenSettingsModal(true)}
          className='cursor-pointer'
        >
          <small className='text-primary'>{allowedSlippage / 100}%</small>
          <EditIcon style={{ marginLeft: 8 }} />
        </Box>
      </Box>
      <Box className='summaryRow'>
        <Box display='flex' alignItems='center'>
          <small>{isExactIn ? t('minReceived') : t('maxSold')}:</small>
          <QuestionHelper text={t('txLimitHelper')} />
        </Box>
        <Box display='flex' alignItems='center'>
          <small>
            {formatTokenAmount(
              slippageAdjustedAmounts[isExactIn ? Field.OUTPUT : Field.INPUT],
            )}{' '}
            {tradeAmount.currency.symbol}
          </small>
          <Box
            width={16}
            height={16}
            ml={0.5}
            borderRadius={8}
            overflow='hidden'
          >
            <CurrencyLogo currency={tradeAmount.currency} size='16px' />
          </Box>
        </Box>
      </Box>
      <Box className='summaryRow'>
        <Box display='flex' alignItems='center'>
          <small>Price Impact:</small>
          <QuestionHelper text={t('priceImpactHelper')} />
        </Box>
        <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
      </Box>
      <Box className='summaryRow'>
        <Box display='flex' alignItems='center'>
          <small>Liquidity Provider Fee:</small>
          <QuestionHelper text={t('liquidityProviderFeeHelper')} />
        </Box>
        <small>
          {formatTokenAmount(realizedLPFee)} {trade.inputAmount.currency.symbol}
        </small>
      </Box>
      <Box className='summaryRow'>
        <Box display='flex' alignItems='center'>
          <small style={{ marginRight: 4 }}>Route</small>
          <QuestionHelper text={t('swapRouteHelper')} />
        </Box>
        <Box>
          {trade.route.path.map((token, i, path) => {
            const isLastItem: boolean = i === path.length - 1;
            return (
              <Box key={i} display='flex' alignItems='center'>
                <small>
                  {token.symbol}{' '}
                  {// this is not to show the arrow at the end of the trade path
                  isLastItem ? '' : ' > '}
                </small>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export const AdvancedSwapDetails: React.FC<AdvancedSwapDetailsProps> = ({
  trade,
}) => {
  const [allowedSlippage] = useUserSlippageTolerance();

  return (
    <>
      {trade && (
        <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
      )}
    </>
  );
};
