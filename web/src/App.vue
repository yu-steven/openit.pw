<template>
  <n-config-provider :locale="zhCN" :theme="darkTheme">
    <n-back-top />
    <n-grid :cols="36" item-responsive>
      <n-gi span="1 1330:8" />
      <n-gi span="34 1330:20">
        <n-card style="margin-top: 15px">
          <n-result :status="resultStatus" :title="resultTitle">
            <template #footer>
              <n-button @click="goToDocs">返回 openit.daycat.space</n-button>
            </template>
          </n-result>
          <n-divider />
          <n-alert
            v-if="showBotInterveneAlert"
            title="自动化程序已介入，预计在2分钟内恢复正常"
            type="success"
            style="margin-block-end: 15px"
          >
            没恢复当我没说<br/>
            介入时间: {{ botInterveneTime }}
          </n-alert>
          <n-alert v-if="showErrorAlert || showBotAlert" title="可用性降低" type="error" style="margin-block-end: 15px">
            本站已被CC攻击，请耐心等待恢复或点击
            <n-a
              href="https://openit.daycat.space/guide/domains.html"
              target="_blank"
            >
              这里
            </n-a>
            查看其他域名或点击
            <n-b
              href="https://openit.checklyhq.com"
              target="_blank"
            >
            这里
            </n-b>
            查看在线情况
            <br/>
            自动化程序预计在10分钟内介入
          </n-alert>
          <div v-if="showErrorAlert == false">
            <n-h2>Clash</n-h2>
            <img src="https://api.checklyhq.com/v1/badges/checks/5feeddfd-f327-4a99-9277-9a7edd406226?style=flat&theme=default" loading="lazy" />
            <n-ul>
              <n-li>https://openit.daycat.space/Clash.yaml</n-li>
            </n-ul>

            <n-h2>Quantumult X</n-h2>
            <img src="https://api.checklyhq.com/v1/badges/checks/875952a4-4e16-4fd3-910a-b700c57641c9?style=flat&theme=default" loading="lazy" />
            <n-ul>
              <n-li>https://openit.daycat.space/Quanx.conf</n-li>
            </n-ul>

            <n-h2>Other</n-h2>
            <img src="https://api.checklyhq.com/v1/badges/checks/a8107f8b-761b-4b5c-a684-74ed4eaf5806?style=flat&theme=default" loading="lazy" />
            <n-ul>
              <n-li>https://openit.daycat.space/https</n-li>
            </n-ul>
            <img src="https://api.checklyhq.com/v1/badges/checks/94ecef57-aedb-47e1-94d8-d8247ea02d9f?style=flat&theme=default" loading="lazy" />
            <n-ul>
              <n-li>https://openit.daycat.space/long</n-li>
            </n-ul>
          </div>
        </n-card>
      </n-gi>
      <n-gi span="1 1330:8" />
    </n-grid>
    <n-global-style />
  </n-config-provider>
</template>

<script>
import { ref, defineComponent } from "vue";
import { darkTheme, zhCN } from "naive-ui";
import {
  NA,
  NGi,
  NH2,
  NLi,
  NUl,
  NCard,
  NGrid,
  NAlert,
  NButton,
  NResult,
  NBackTop,
  NDivider,
} from "naive-ui";
import { NGlobalStyle, NConfigProvider } from "naive-ui";

/**
 * 整理查询参数
 * @param {String} search location.search
 * @returns {JSON|String} 整理后的查询参数
 */
const getSearch = (search) => {
  if (search == "") {
    return "";
  } else {
    const searchList = search.replace("?", "").split("&");
    const searchData = {};
    for (const i in searchList) {
      const tmp = searchList[i].split("=");

      searchData[tmp[0]] = tmp[1];
    }
    return searchData;
  }
};

const setError = () => {
  showErrorAlert.value = true;
  resultStatus.value = "500";
  resultTitle.value = "可用性降低";
  document.title = "可用性降低";
}

const init = () => {
  if (showBotInterveneAlert.value) {
    resultStatus.value = "500";
    resultTitle.value = "可用性降低";
    document.title = "可用性降低";
    return;
  }
  const pathName = location.pathname;
  const search = getSearch(location.search);
  const pathList = [
    "/CLASH",
    "/Clash",
    "/clash",
    "/Clash.yaml",
    "/qx",
    "/quanx",
    "/Quanx",
    "/Quanx.conf",
    "/https",
    "/long",
  ];

  for (const i in pathList) {
    const plName = pathList[i];
    if (plName == pathName) {
      setError();
    } else if (
      pathName.split("/")[1] == "get" &&
      search != "" &&
      (search.type == "clash" ||
        search.type == "Clash" ||
        search.type == "long" ||
        search.type == "Long" ||
        search.type == "https")
    ) {
      setError();
    }
  }
};

const showErrorAlert = ref(false);
const showBotInterveneAlert = ref(false);
const botInterveneTime = ref("Undefined");
const resultStatus = ref("418");
const resultTitle = ref("需要杯茶吗");
export default defineComponent({
  components: {
    NA,
    NGi,
    NH2,
    NLi,
    NUl,
    NCard,
    NGrid,
    NAlert,
    NButton,
    NResult,
    NBackTop,
    NDivider,
    // Config
    NGlobalStyle,
    NConfigProvider,
  },
  setup() {
    init();
    return {
      zhCN,
      darkTheme,
      showErrorAlert,
      showBotInterveneAlert,
      botInterveneTime,
      resultStatus,
      resultTitle,
      goToDocs: () => {
        location.href = "https://openit.daycat.space/";
      },
    };
  },
});
</script>

<style>
a {
  text-decoration: none;
}
</style>
