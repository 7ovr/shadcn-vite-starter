import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchWaitlist, joinWaitlist } from '@/features/waitlist/api'

export const waitlistQueryOptions = queryOptions({
  queryKey: ['waitlist'],
  queryFn: fetchWaitlist,
})

export function useJoinWaitlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: joinWaitlist,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: waitlistQueryOptions.queryKey,
      }),
  })
}
