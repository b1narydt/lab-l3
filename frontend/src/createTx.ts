import {
    CreateActionArgs,
    CreateActionResult,
    Transaction,
    WalletClient,
    WERR_REVIEW_ACTIONS
  } from '@bsv/sdk'
  
  export const createTransaction = async (): Promise<void> => {
    try {
      const lockingScript =
        '2102aaa7a5a2e386840889732be8d8264d42198f116903ed9f8f2cc9763c0e9958acac0e4d7920666972737420746f6b656e0849276d204d6174744630440220187800c3732512ef3d3ccdf741966b45f4251f879ac933160837a03d1c98a420022064c4d3fb3c07b12c47aae5baef7890e996ffa680e32fb8aa678c7f06ff0d37bd6d75'
      const walletClient = new WalletClient()
      const args: CreateActionArgs = {
        description: 'Create a transaction',
        outputs: [
          // TODO: Define the transaction output with the lockingScript, 5 satoshis, and an output description
          {
            lockingScript: lockingScript,
            satoshis: 5, // 5 satoshis
            outputDescription: 'Payment to merchant'
          }
        ]
      }
  
      // Call walletClient.createAction with args and log the result
      const result = await walletClient.createAction(args)
      
      // Log the full result for debugging
      console.log('Transaction creation result:', result)
      
      // If there's a transaction in the result, log its details
      if (result.tx) {
        console.log('Transaction created successfully:', {
          txid: result.txid,  // The transaction ID
          status: result.sendWithResults?.[0]?.status || 'unknown',  // Transaction status
          // You can add more details here if needed
        })
        
        // If you need to work with the transaction object, you can convert it
        const tx = Transaction.fromAtomicBEEF(result.tx)
        console.log('Transaction details:', {
          id: tx.id,
          // Add other transaction properties you need
        })
      } else {
        console.log('No transaction was created. Result:', result)
      }
    } catch (error: unknown) {
      if (error instanceof WERR_REVIEW_ACTIONS) {
        console.error('Wallet threw WERR_REVIEW_ACTIONS:', {
          code: error.code,
          message: error.message,
          reviewActionResults: error.reviewActionResults,
          sendWithResults: error.sendWithResults,
          txid: error.txid,
          tx: error.tx,
          noSendChange: error.noSendChange
        })
      } else if (error instanceof Error) {
        console.error('Failed with error status:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
          error: error
        })
      } else {
        console.error('Failed with unknown error:', error)
      }
      throw error
    }
  }