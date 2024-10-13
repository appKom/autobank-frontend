export interface Receipt_Info {
  receiptId: number;
  amount: number;
  receiptName: string;
  receiptDescription: string;
  receiptCreatedAt: string;
  committeeName: string;
  userFullname: string;
  paymentOrCard: string;
  attachmentCount: number;
  latestReviewStatus: string;
  latestReviewCreatedAt: string;
}

export interface CompleteReceipt {
  receiptId: number;
  amount: number;
  receiptName: string;
  receiptDescription: string;
  receiptCreatedAt: string;
  committeeName: string;
  userFullname: string;
  paymentOrCard: string;
  attachmentCount: number;
  latestReviewStatus: string;
  latestReviewCreatedAt: string;
  latestReviewComment: string;
  paymentAccountNumber: string;
  cardCardNumber: string;
  attachments: string[];
}

export interface ReceiptReview {
  receiptId: number;
  status: string;
  comment: string;
}


export const fetchAllReceipts = async (getAccessTokenSilently: Function, from: Number, count: Number): Promise<Receipt_Info[]> => {
  const accesstoken = await getAccessTokenSilently();
  return fetch(import.meta.env.VITE_BACKEND_URI as string + '/api/admin/receipt/all?from=' + from + '&count=' + count,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + accesstoken,
      },
    }
  ).then((res) => res.json()
  );
};

export const fetchCompleteReceipt = async (getAccessTokenSilently: Function, receiptId: Number): Promise<CompleteReceipt> => {
  const accesstoken = await getAccessTokenSilently();
  const res = await fetch(import.meta.env.VITE_BACKEND_URI as string + '/api/admin/receipt/get/' + receiptId,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + accesstoken,
      },
    }
  )
  
  if (res.ok) {
    console.log("f")
    return res.json();
  } else {
    console.log("fff")
    throw new Error('Failed to fetch receipt');
  }
}

export const postReceiptReview = async (getAccessTokenSilently: Function, receiptreview: ReceiptReview): Promise<void> => {
  const accesstoken = await getAccessTokenSilently();
  const res = await fetch(import.meta.env.VITE_BACKEND_URI as string + '/api/admin/receipt/review',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + accesstoken,
      },
      body: JSON.stringify(receiptreview)
    }
  )

  if (res.status == 200) {
    console.log("AAA")
    return;
  } else {
    console.log("BBB")
    throw new Error('Failed to post receipt review');
  }
}