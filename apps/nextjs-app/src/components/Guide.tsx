import type { IUserMeVo } from '@teable/openapi';
import { useRouterState } from '@tanstack/react-router';
import { useTranslation, Trans } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import JoyRide from 'react-joyride';
import { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import type { CallBackProps, Step, StoreHelpers } from 'react-joyride';
import colors from 'tailwindcss/colors';
import { tableConfig } from '@/features/i18n/table.config';
import { useCompletedGuideMapStore } from './store';

// Use JoyRide directly (client-side only rendering handled by component)
const JoyRideNoSSR = JoyRide;

export const GUIDE_PREFIX = 't-guide-';

export const GUIDE_CREATE_SPACE = GUIDE_PREFIX + 'create-space';
export const GUIDE_CREATE_BASE = GUIDE_PREFIX + 'create-base';
export const GUIDE_CREATE_TABLE = GUIDE_PREFIX + 'create-table';
export const GUIDE_CREATE_VIEW = GUIDE_PREFIX + 'create-view';
export const GUIDE_VIEW_FILTERING = GUIDE_PREFIX + 'view-filtering';
export const GUIDE_VIEW_SORTING = GUIDE_PREFIX + 'view-sorting';
export const GUIDE_VIEW_GROUPING = GUIDE_PREFIX + 'view-grouping';
export const GUIDE_API_BUTTON = GUIDE_PREFIX + 'api-button';

export enum StepKey {
  CreateSpace = 'createSpace',
  CreateBase = 'createBase',
  CreateTable = 'createTable',
  CreateView = 'createView',
  ViewFiltering = 'viewFiltering',
  ViewSorting = 'viewSorting',
  ViewGrouping = 'viewGrouping',
  ApiButton = 'apiButton',
}

type EnhanceStep = { key: StepKey; step: Step };

const findStepsForPath = (
  guideMap: Record<string, EnhanceStep[]>,
  path: string
): EnhanceStep[] | null => {
  if (guideMap[path]) {
    return guideMap[path];
  }

  const includePath = Object.keys(guideMap).find((p) => path.includes(p));

  if (includePath) {
    return guideMap[includePath];
  }

  return null;
};

export const Guide = ({ user }: { user?: IUserMeVo }) => {
  const routerState = useRouterState();
  const { t } = useTranslation(tableConfig.i18nNamespaces);
  const { completedGuideMap, setCompletedGuideMap } = useCompletedGuideMapStore();

  const helpers = useRef<StoreHelpers>();
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  const userId = user?.id;
  const pathname = routerState.location.pathname;
  const isReady = routerState.isLoading === false;

  const guideStepMap: Record<StepKey, Step> = useMemo(
    () => ({
      [StepKey.CreateSpace]: {
        target: `.${GUIDE_CREATE_SPACE}`,
        title: <div className="text-base">createSpaceTooltipTitle</div>,
        content: (
          <div className="text-left text-[13px]">
            <Trans
              ns="common"
              i18nKey="guide.createTableTooltipContent"
              components={{ br: <br /> }}
            />
          </div>
        ),
        disableBeacon: true,
      },
      [StepKey.CreateBase]: {
        target: `.${GUIDE_CREATE_BASE}`,
        title: <div className="text-base">createBaseTooltipTitle</div>,
        content: <div className="text-left text-[13px]">createBaseTooltipContent</div>,
        disableBeacon: true,
      },
      [StepKey.CreateTable]: {
        target: `.${GUIDE_CREATE_TABLE}`,
        title: <div className="text-base">{t('guide.createTableTooltipTitle')}</div>,
        content: (
          <div className="text-left text-[13px]">{t('guide.createTableTooltipContent')}</div>
        ),
        disableBeacon: true,
        placement: 'right',
      },
      [StepKey.CreateView]: {
        target: `.${GUIDE_CREATE_VIEW}`,
        title: <div className="text-base">{t('guide.createViewTooltipTitle')}</div>,
        content: (
          <div className="text-left text-[13px]">
            <Trans
              ns="common"
              i18nKey="guide.createViewTooltipContent"
              components={{ br: <br /> }}
            />
          </div>
        ),
        disableBeacon: true,
      },
      [StepKey.ViewFiltering]: {
        target: `.${GUIDE_VIEW_FILTERING}`,
        title: <div className="text-base">{t('guide.viewFilteringTooltipTitle')}</div>,
        content: (
          <div className="text-left text-[13px]">
            <Trans
              ns="common"
              i18nKey="guide.viewFilteringTooltipContent"
              components={{ br: <br /> }}
            />
          </div>
        ),
        disableBeacon: true,
      },
      [StepKey.ViewSorting]: {
        target: `.${GUIDE_VIEW_SORTING}`,
        title: <div className="text-base">{t('guide.viewSortingTooltipTitle')}</div>,
        content: (
          <div className="text-left text-[13px]">
            <Trans
              ns="common"
              i18nKey="guide.viewSortingTooltipContent"
              components={{ br: <br /> }}
            />
          </div>
        ),
        disableBeacon: true,
      },
      [StepKey.ViewGrouping]: {
        target: `.${GUIDE_VIEW_GROUPING}`,
        title: <div className="text-base">{t('guide.viewGroupingTooltipTitle')}</div>,
        content: (
          <div className="text-left text-[13px]">{t('guide.viewGroupingTooltipContent')}</div>
        ),
        disableBeacon: true,
      },
      [StepKey.ApiButton]: {
        target: `.${GUIDE_API_BUTTON}`,
        title: <div className="text-base">{t('guide.apiButtonTooltipTitle')}</div>,
        content: (
          <div className="text-left text-[13px]">
            {t('guide.apiButtonTooltipContent')}
          </div>
        ),
        disableBeacon: true,
      },
    }),
    [t]
  );

  const orderedGuideMap: Record<string, EnhanceStep[]> = useMemo(
    () => ({
      '/table/$tableId/$viewId': [
        { key: StepKey.CreateTable, step: guideStepMap[StepKey.CreateTable] },
        { key: StepKey.CreateView, step: guideStepMap[StepKey.CreateView] },
        { key: StepKey.ViewFiltering, step: guideStepMap[StepKey.ViewFiltering] },
        { key: StepKey.ViewSorting, step: guideStepMap[StepKey.ViewSorting] },
        { key: StepKey.ViewGrouping, step: guideStepMap[StepKey.ViewGrouping] },
        { key: StepKey.ApiButton, step: guideStepMap[StepKey.ApiButton] },
      ],
    }),
    [guideStepMap]
  );

  const getHelpers = (storeHelpers: StoreHelpers) => {
    helpers.current = storeHelpers;
  };

  const onCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if ([ACTIONS.CLOSE, ACTIONS.SKIP].includes(action as never)) {
      setRun(false);
      if (!userId) return;
      return setCompletedGuideMap(userId, Object.keys(guideStepMap));
    }

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type as never)) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (status === STATUS.FINISHED || type === EVENTS.TOUR_END) {
      setRun(false);

      if (!userId) return;
      const prevCompletedStepKeys = completedGuideMap[userId] || [];
      const enhanceSteps = findStepsForPath(orderedGuideMap, pathname);
      if (!enhanceSteps?.length) return;
      setCompletedGuideMap(userId, [
        ...new Set([...prevCompletedStepKeys, ...enhanceSteps.map(({ key }) => key)]),
      ]);
    }
  };

  useEffect(() => {
    // Reset guide on route change
    const resetGuide = () => {
      setStepIndex(0);
      helpers.current?.reset(false);
    };

    // TanStack Router doesn't have events like Next.js
    // We'll reset when pathname changes
    resetGuide();
  }, [pathname]);

  useEffect(() => {
    if (!isReady) return;

    let enhanceSteps = findStepsForPath(orderedGuideMap, pathname);

    if (!enhanceSteps?.length) return;

    if (userId) {
      const prevCompletedSteps = completedGuideMap[userId] || [];

      if (prevCompletedSteps.length) {
        enhanceSteps = enhanceSteps.filter(({ key }) => !prevCompletedSteps.includes(key));
      }
    }

    if (!enhanceSteps.length) return;

    const steps = enhanceSteps.map(({ step }) => step);

    let retryCount = 0;
    let timer: number | undefined;

    timer = window.setInterval(() => {
      const step = steps[stepIndex];

      if (!step) {
        clearInterval(timer);
        timer = undefined;
        return;
      }

      const targetElement = document.querySelector(step.target as string);

      if (targetElement) {
        clearInterval(timer);
        timer = undefined;
        setSteps(steps);
        setRun(true);
        setTimeout(() => helpers.current?.reset(true), 100);
      } else {
        if (++retryCount >= 100) {
          clearInterval(timer);
          timer = undefined;
        }
      }
    }, 50);

    return () => {
      clearInterval(timer);
      timer = undefined;
    };
  }, [completedGuideMap, isReady, orderedGuideMap, pathname, stepIndex, userId]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <JoyRideNoSSR
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      spotlightPadding={8}
      continuous
      showSkipButton
      hideBackButton
      hideCloseButton
      disableCloseOnEsc
      disableOverlayClose
      disableScrollParentFix
      styles={{
        options: {
          primaryColor: colors.black,
          width: 320,
        },
        tooltip: {
          padding: 12,
        },
        tooltipContent: {
          padding: 8,
          lineHeight: '22px',
        },
        buttonClose: {
          width: 10,
          height: 10,
          outline: 'none',
        },
        buttonNext: {
          fontSize: 13,
          padding: '8px 16px',
          outline: 'none',
        },
        buttonBack: {
          fontSize: 13,
          padding: '8px 16px',
          outline: 'none',
        },
        buttonSkip: {
          fontSize: 13,
          padding: '8px 16px',
          outline: 'none',
        },
        tooltipFooter: {
          marginTop: 8,
        },
        spotlight: {
          border: `1px solid ${colors.white}`,
          borderRadius: 8,
        },
      }}
      getHelpers={getHelpers}
      callback={onCallback}
      locale={{
        back: t('guide.prev'),
        next: t('guide.next'),
        last: t('guide.done'),
        skip: t('guide.skip'),
      }}
    />
  );
};
