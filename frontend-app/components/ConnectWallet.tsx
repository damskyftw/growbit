import { useAccount, useConnect } from 'wagmi';

const ConnectWallet = () => {
  const { isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();

  if (isConnected) {
    return null;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-6">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-3">Connect Wallet</p>
        <div className="flex flex-col space-y-2">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={!connector.ready}
              className={`
                px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed
                ${connector.id === 'coinbaseWallet' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {connector.name}
              {connector.id === 'coinbaseWallet' && (
                <span className="ml-1 text-xs">(Smart Wallet)</span>
              )}
              {isLoading && pendingConnector?.id === connector.id && ' (connecting...)'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectWallet; 