import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import EthBanner from '../EthBanner'
import CompetitionBanner from '../CompetitionBanner'
import IFOBanner from '../IFOBanner'
import V3LaunchBanner from '../V3LaunchBanner'
import PerpetualBanner from '../PerpetualBanner'
import LiquidStakingBanner from '../LiquidStakingBanner'
import PancakeProtectorBanner from '../PancakeProtectorBanner'
import FarmV3MigrationBanner from '../FarmV3MigrationBanner'
import useIsRenderCompetitionBanner from './useIsRenderCompetitionBanner'
import useIsRenderIfoBanner from './useIsRenderIFOBanner'
import useIsRenderUserBanner from './useIsRenderUserBanner'
import TradingRewardBanner from '../TradingRewardBanner'
import { GalxeTraverseBanner } from '../GalxeTraverseBanner'
import { PolygonZkEvmBanner } from '../PolygonZkEvmBanner'
import UserBanner from '../UserBanner'

interface IBannerConfig {
  shouldRender: boolean
  banner: ReactElement
}

/**
 * make your custom hook to control should render specific banner or not
 * add new campaign banner easily
 *
 * @example
 * ```ts
 *  {
 *    shouldRender: isRenderIFOBanner,
 *    banner: <IFOBanner />,
 *  },
 * ```
 */

export const useMultipleBannerConfig = () => {
  const isRenderIFOBanner = useIsRenderIfoBanner()
  const isRenderCompetitionBanner = useIsRenderCompetitionBanner()
  const isRenderUserBanner = useIsRenderUserBanner()

  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: isRenderUserBanner, banner: <UserBanner /> },
      { shouldRender: true, banner: <PolygonZkEvmBanner /> },
      { shouldRender: true, banner: <GalxeTraverseBanner /> },
      { shouldRender: true, banner: <PancakeProtectorBanner /> },
      { shouldRender: true, banner: <TradingRewardBanner /> },
      { shouldRender: true, banner: <LiquidStakingBanner /> },
      { shouldRender: true, banner: <V3LaunchBanner /> },
      { shouldRender: true, banner: <FarmV3MigrationBanner /> },
      { shouldRender: true, banner: <EthBanner /> },
      {
        shouldRender: isRenderIFOBanner,
        banner: <IFOBanner />,
      },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: isRenderCompetitionBanner,
        banner: <CompetitionBanner />,
      },
      {
        shouldRender: true,
        banner: <PerpetualBanner />,
      },
    ]
    return [...NO_SHUFFLE_BANNERS, ...shuffle(SHUFFLE_BANNERS)]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [isRenderIFOBanner, isRenderCompetitionBanner, isRenderUserBanner])
}
