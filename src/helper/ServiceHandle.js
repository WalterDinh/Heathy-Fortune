import { create } from "apisauce";
import * as Consts from "./Consts";

class serviceHandle {
    constructor() {
        this.api = create({
            baseURL: Consts.HOST,
            timeout: 10000,
            header: {
                "content-type": `application/json`
            }
        });
        this.apiUpload = create({
            baseURL: "https://api.imgur.com",
            timeout: 10000,
            headers: {
                "content-type": `multipart/form-data`,
                Authorization: `Client-ID 5d5b71bd7af8486`
            }
        });
    }

    returnData(response) {
        console.log("returnData ===>>>>>>>>>>>>>>", response);

        let errorMessage = "";
        if (Consts.STATUS_CODE.SUCCESS.includes(response.status) && response.ok) {
            return {
                response: response.data,
                error: false
            };
        }
        // response.data = JSON.parse(response.data);
        if (Consts.STATUS_CODE.NOTFOUND.includes(response.status)) {
            errorMessage = `${response.data.detail ? response.data.detail : response.data}`;
        } else if (response.data) {
            errorMessage = response.data;
        } else if (Consts.STATUS_CODE.AUTH.includes(response.status)) {
            errorMessage = `${response.data.detail ? response.data.detail : response.data}`;
        } else {
            errorMessage = response.problem;
        }
        return {
            errorMessage,
            error: true
        };
    }

    setToken = token => {
        this.api.setHeader("Authorization", `Token ${token}`);
    };

    get = async (url, params) => {
        const response = await this.api.get(url, params);
        // logic handle response here
        return this.returnData(response);
    };

    post = async (url, payload) => {
        console.log("----->", url, payload);
        const response = await this.api.post(url, payload);

        // logic handle response here
        console.log("response ----->", response);
        return this.returnData(response);
    };

    put = async (url, payload) => {
        const response = await this.api.put(url, payload);
        // logic handle response here
        return this.returnData(response);
    };

    patch = async (url, payload) => {
        const response = await this.api.patch(url, payload);

        // logic handle response here
        return this.returnData(response);
    };
    delete = async (url, params) => {
        const response = await this.api.delete(url, params);
        console.log("returnData ===>>>>>>>>>>>>>>  delete", response);
        // logic handle response here
        return this.returnData(response);
    };

    uploadImage = async file => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await this.apiUpload.post("/3/image", formData);
        // logic handle response here
        return this.returnData(response);
    };
    // xhrRequest = async (url) =>{
    //   const response = await this.api.get(url);
    //   // logic handle response here
    //   return this.returnData(response);
    // }
}

export let ServiceHandle = new serviceHandle();
