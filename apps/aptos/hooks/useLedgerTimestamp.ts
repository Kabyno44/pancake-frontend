import { useCallback } from 'react'
import { useSWRConfig } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { fetchLedgerInfo } from '@pancakeswap/awgmi/core'
import { useActiveChainId } from './useNetwork'

export const useLedgerTimestamp = () => {
  const chainId = useActiveChainId()
  const { mutate } = useSWRConfig()
  const { data: lastCheck } = useSWRImmutable(['ledgerTimestampLastCheck', chainId])

  const { data: ledgerTimestamp, error } = useSWRImmutable(
    ['ledgerTimestamp', chainId],
    async () => {
      /* eslint-disable camelcase */
      const { ledger_timestamp } = await fetchLedgerInfo()
      mutate(['ledgerTimestampLastCheck', chainId], Date.now(), { revalidate: false })
      return Math.floor(parseInt(ledger_timestamp) / 1000)
      /* eslint-enable camelcase */
    },
    {
      dedupingInterval: 1000 * 15,
      refreshInterval: 1000 * 15,
      keepPreviousData: true,
    },
  )

  const getNowFallback = useCallback(() => Date.now(), [])

  const getNow = useCallback(() => {
    const timeDiff = Date.now() - lastCheck
    return lastCheck && ledgerTimestamp ? ledgerTimestamp + timeDiff : Date.now()
  }, [lastCheck, ledgerTimestamp])

  return error ? getNowFallback : lastCheck && ledgerTimestamp ? getNow : getNowFallback
}

export default useLedgerTimestamp
