const defaultConfig = {
  baseSettings: {
    apiKey: "YOUR_API_KEY", // required
    integrationId: "YOUR_INTEGRATION_ID", // required
    organizationId: "YOUR_ORGANIZATION_ID", // required
    primaryBrandColor: "#26D6FF", // required -- your brand color, the widget color scheme is derived from this
    organizationDisplayName: "Inkeep",
    // ...optional settings
  },
  modalSettings: {
    // optional settings
  },
  searchSettings: {
    // optional settings
  },
  aiChatSettings: {
    // optional settings
    botAvatarSrcUrl: "/img/logo.svg", // optional -- use your own bot avatar
    quickQuestions: [
      "Example question 1?",
      "Example question 2?",
      "Example question 3?",
    ],
  },
};

let chatButtonWidget = null;
let searchBarWidget = null;

const searchBarConfig = (targetElement) => {
  return {
    componentType: "SearchBar",
    targetElement,
    colorModeSync: {
      observedElement: document.documentElement,
      isDarkModeCallback: (observedElement) =>
        observedElement.dataset.theme === "dark",
      colorModeAttribute: "data-theme",
    },
    properties: {
      ...defaultConfig,
      baseSettings: defaultConfig.baseSettings,
      modalSettings: defaultConfig.modalSettings,
      searchSettings: defaultConfig.searchSettings,
      aiChatSettings: defaultConfig.aiChatSettings,
    },
  };
};

const inkeepSearchBarDiv = document.createElement("div");
inkeepSearchBarDiv.id = "inkeepSearchBar";

const observer = new MutationObserver(() => {
  const inkeepWidgetContainer = document.getElementById("search");
  const isRender = !searchBarWidget && inkeepWidgetContainer;

  if (inkeepWidgetContainer) {
    inkeepWidgetContainer.appendChild(inkeepSearchBarDiv);
  }

  if (isRender)
    searchBarWidget = Inkeep().embed(searchBarConfig(inkeepSearchBarDiv));
});

observer.observe(document.documentElement, { attributes: true });

// Use window.inkeep.embedChatButton to embed the chat button with your config
// Use window.inkeep.renderChatButton to change config on the fly
function embedChatButton(config) {
  const deepMergedConfig = deepMergeObjects(defaultConfig, config);

  const chatButtonConfig = {
    componentType: "ChatButton",
    colorModeSync: {
      observedElement: document.documentElement,
      isDarkModeCallback: (observedElement) =>
        observedElement.dataset.theme === "dark",
      colorModeAttribute: "data-theme",
    },
    properties: {
      ...deepMergedConfig,
      baseSettings: deepMergedConfig.baseSettings,
      modalSettings: deepMergedConfig.modalSettings,
      searchSettings: deepMergedConfig.searchSettings,
      aiChatSettings: deepMergedConfig.aiChatSettings,
    },
  };

  if (!chatButtonWidget) chatButtonWidget = Inkeep().embed(chatButtonConfig);

  window.Inkeep.renderChatButton = (config) => {
    const deepMergedConfig = deepMergeObjects(defaultConfig, config);

    chatButtonWidget.render(deepMergedConfig);
    searchBarWidget.render(deepMergedConfig);
  };

  return chatButtonWidget.render;
}

window.Inkeep.embedChatButton = embedChatButton;

// Use this or any other library approach that you have on your project (lodash.deepMerge for example)
// Deep merge object, this way or use your own library approach
const deepMergeObjects = (obj1, obj2) => {
  const merged = { ...obj1 };

  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === "object" && !Array.isArray(obj2[key])) {
        if (typeof merged[key] === "object" && !Array.isArray(merged[key])) {
          merged[key] = deepMergeObjects(merged[key], obj2[key]);
        } else {
          merged[key] = { ...obj2[key] };
        }
      } else {
        merged[key] = obj2[key];
      }
    }
  }

  return merged;
};
