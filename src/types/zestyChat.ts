export type ZestyChatRole = "user" | "assistant";

export interface ZestyMenuItem {
  productId: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  allergens: string[];
  dietary?: string;
}

export type ZestyUiCard =
  | {
      type: "reservation_confirmation";
      data: {
        reservationId: string;
        date: string;
        time: string;
        partySize: number;
      };
    }
  | {
      type: "menu_results";
      data: {
        items: ZestyMenuItem[];
      };
    };

export interface ZestyChatHistoryEntry {
  role: ZestyChatRole;
  content: string;
}

export interface ZestyChatMessage {
  id: string;
  role: ZestyChatRole;
  content: string;
  uiCard?: ZestyUiCard;
}

export interface ZestyChatResponse {
  reply: string;
  sessionId: string;
  uiCard?: ZestyUiCard;
  /** When true, re-fetch customer savedCart/savedWishlist from the API. */
  refreshCustomerLists?: boolean;
}

export interface ZestyChatSessionSummary {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface ZestyStoredChatMessage {
  role: ZestyChatRole;
  content: string;
  uiCard?: ZestyUiCard;
  createdAt: string;
}
