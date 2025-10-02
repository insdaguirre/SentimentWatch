```mermaid
flowchart LR
    subgraph Sources
        A[Reddit_API] -->|posts| B[Ingestion_Worker]
        C[StockTwits_API] -->|messages| B
        D[News_RSS_API] -->|headlines| B
    end

    B -->|normalize_dedupe| E[Sentiment_Model_FinBERT]
    E -->|scores| F[MongoDB_Hot_Store]
    B -->|archive| G[S3_R2_Cold_Store]

    F -->|query| H[Express_API]
    H -->|feed_leaders| I[React_Frontend]

    H -->|context_posts| J[Local_LLM]
    J -->|summaries| I
