import { PerpAccount, ZERO_BN } from '@blockworks-foundation/mango-client'
import SideBadge from './SideBadge'

const PerpSideBadge = ({ perpAccount }: { perpAccount: PerpAccount }) => (
  <div className="sol-perp-position-down-count">
    {perpAccount && !perpAccount.basePosition.eq(ZERO_BN) ? (
      <SideBadge
        side={perpAccount.basePosition.gt(ZERO_BN) ? 'long' : 'short'}
      />
    ) : (
      '--'
    )}
  </div>
)

export default PerpSideBadge
