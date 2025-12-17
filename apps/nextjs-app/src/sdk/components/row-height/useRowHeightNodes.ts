import { RowHeightLevel } from '@teable/core';
import { useMemo } from 'react';
import { useTranslation } from '../../context/app/i18n';
import { DivideSquare, Menu, Square, StretchHorizontal } from '../icons';

export const useRowHeightNodes = () => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        label: t('rowHeight.short'),
        value: RowHeightLevel.Short,
        Icon: Menu,
      },
      {
        label: t('rowHeight.medium'),
        value: RowHeightLevel.Medium,
        Icon: StretchHorizontal,
      },
      {
        label: t('rowHeight.tall'),
        value: RowHeightLevel.Tall,
        Icon: DivideSquare,
      },
      {
        label: t('rowHeight.extraTall'),
        value: RowHeightLevel.ExtraTall,
        Icon: Square,
      },
    ],
    [t]
  );
};
