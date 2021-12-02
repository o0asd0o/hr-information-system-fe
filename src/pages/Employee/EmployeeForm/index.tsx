import React, { useEffect, useState } from 'react';
import { CivilStatus, DivisionType, EmploymentStatus, Gender } from '@/models/api/common/enums';
import { ConnectState } from '@/models/connect';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input, Checkbox, InputNumber, Radio, Typography, Row, Col, Select, Divider, Upload, message } from "antd";
import { titleCase } from "title-case";
import { FormInstance } from 'antd/lib/form/Form';

import { connect, Dispatch } from 'umi';
import Avatar from '@/components/Upload';
import styles from "./index.less";
import { getInitialValues, getTouchedValues, valueFormatTransformer } from "./util";
import { UploadOutlined } from '@ant-design/icons';
import { DivisionEntity } from '@/models/api/division';
import { EmployeeEntity } from "@/models/api/employee";
import ImgCrop from 'antd-img-crop';
import EditButton from '@/components/EditButton';
import DatePicker from '@/components/DatePicker';

// returns { regions: [...], provinces: [...], citiies: [...] }
var philippines = require('philippines');
const { cities, provinces } = philippines;

type CitiyProps = {
  city: boolean;
  name: string;
  province: string; 
}
type ProvinceProp = {
  key: string;
  name: string;
};

const FormItem = Form.Item
const { Option } = Select;

export type EmployeeProps = {
  dispatch: Dispatch;
  hasLoginError?: boolean;
  divisions: DivisionEntity[];
  submitting?: boolean;
  loadingDivisions?: boolean;
  isUpdating?: boolean;
  selectedEmployee?: EmployeeEntity;
};

type ErrorDrilldown = {
  errors: string[],
  name: string[],
};

type ValuesType = {
  errorFields?: ErrorDrilldown[];
  [key: string]: any,
};

const EmployeeForm: React.FC<EmployeeProps> = (props) => {
  const [form] = Form.useForm();
  const { submitting, loadingDivisions, divisions, isUpdating, selectedEmployee } = props;
  const [provinceValue, setProvinceValue] = useState("");
  const [selectedDivisionType, setSelectedDivisionType] = useState("");
  // editing
  const [editingProfile, setEditingProfile] = useState(!isUpdating);
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(!isUpdating);
  const [editingGovId, setEditingGovId] = useState(!isUpdating);
  const [editingOnboardingInfo, setEditingOnboardingInfo] = useState(!isUpdating);
  const [editingPresentAddress, setEditingPresentAddress] = useState(!isUpdating);
  const [editingPermanentAddress, setEditingPermanentAddress] = useState(!isUpdating);

  const initialValues = getInitialValues(props);

  useEffect(() => {
    if (isUpdating) {
      const { dispatch } = props;
      const value = selectedEmployee?.divisionType as DivisionType;
      setSelectedDivisionType(value);
      dispatch({
        type: 'employee/getEmployeeFormDivisions',
        payload: { divisionType: value },
      });
    }
    document.querySelectorAll(".ant-select-selector input").forEach((element) => element.setAttribute("autocomplete", "off"))
  }, []);

  const formRef = React.createRef<FormInstance<any>>(); 
  const onFinish = (values: { [key: string]: any }) => {
    const { dispatch } = props;
    const { isFieldTouched } = formRef.current!;

    const touchedValues = getTouchedValues(isFieldTouched, values);

    dispatch({
      type: `employee/${isUpdating ? "updateEmployee" : "createEmployee"}`,
      payload: isUpdating ? touchedValues : values,
      employeeId: selectedEmployee?.identifier
    });
  };

  const onFinishFailed = (formValues: ValuesType) => {
    if (formValues.errorFields && formValues.errorFields.length) {
      const toScroll = formValues.errorFields[0].name[0];
      let elementToScroll: Element | null;
      if (toScroll === "profilePicture") {
        elementToScroll = document.querySelector(".ant-upload");
        elementToScroll?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      } else {
        elementToScroll = document.querySelector(`#basic_${toScroll}`);
        elementToScroll?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })
      }
    }
    // ant-upload
    message.error("Please fill out all required fields!");
  }

  const onValueChange = (changedValues: ValuesType, values: ValuesType) => {
    const [key, value] = Object.entries(changedValues)[0];

    let newEntry = valueFormatTransformer[key];
    newEntry = newEntry ? newEntry(value) : false;
    const { setFieldsValue, setFields } = formRef.current!;

    if (newEntry) {
      setFieldsValue({
        [newEntry.key]: newEntry.value,
      })
    }

    if (key === "province") {
      if (value !== provinceValue) {
        setFieldsValue({
          "cityMunicipality": null,
        })
      }
      setProvinceValue(value);
    }

    if (key === "divisionType") {
      const { dispatch } = props;
      if (value !== selectedDivisionType) {
        setFieldsValue({
          "division": null,
        })
      }
      setSelectedDivisionType(value)
      dispatch({
        type: 'employee/getEmployeeFormDivisions',
        payload: { divisionType: value },
      });
    }

    if (key === "sameAsPresent") {
      const addressFields = ["streetAddress", "addressLine2", "province", "cityMunicipality", "postalCode"];
      const resultValue = !value;

      const fieldsToUpdate = addressFields.map((key: string) => {
        return {
          name: `${key}_1`,
          value: resultValue ? values[key] : undefined
        }
      }, {});

      setFields(fieldsToUpdate)
      setFieldsValue({ "sameAsPresent": resultValue });
    }
  };

  const divisionLabel = `${selectedDivisionType === DivisionType.PMO ? "Property" : "Deployment"}`;
  const customProfilePicName = isUpdating ? selectedEmployee?.profilePicture : "";

  return (
    <Form
      form={form}
      style={{ marginTop: 8 }}
      layout="vertical"
      name="basic"
      onFinish={onFinish}
      initialValues={initialValues}
      // @ts-ignore
      onFinishFailed={onFinishFailed}
      onValuesChange={onValueChange}
      ref={formRef}
    > 
      <div className={styles.main}>
        <PageContainer>
          <Typography.Title level={2} >Create New Employee</Typography.Title>
          <Card className={styles.card}>
            <EditButton onToggleEdit={() => setEditingProfile(!editingProfile)} isUpdating={isUpdating} />
            <Row gutter={16} >
              <Col span={6} offset={6} className={styles.wrapper}>
                <FormItem name="profilePicture" rules={[{ required: true, message: "Profile Picture is required" }]}>
                  <ImgCrop> 
                    <Avatar disabled={!editingProfile} customImage={customProfilePicName} onChange={(info) => {
                      form.setFields([{ name: "profilePicture", value: info.file }])
                    }}/>
                  </ImgCrop>
                </FormItem>
                
              </Col>
              <Col span={6}>
                <FormItem name="employeeIdNumber"
                  label={"Employee ID Number"}
                  rules={[{ required: true, message: "Employee ID Number is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingProfile} autoFocus={true} tabIndex={1} placeholder={"SVK-XXXXXXXXXXXXX"} />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="Personal Information" className={styles.card}>
            <EditButton onToggleEdit={() => setEditingPersonalInfo(!editingPersonalInfo)} isUpdating={isUpdating} />
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="firstName"
                  label={"First Name"}
                  rules={[{ required: true, message: "First Name is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={1} placeholder={"e.g. Juan"} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="emailAddress"
                  label={"Email Address"}
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={5} type="email" placeholder={"e.g juandelacruz@gmail.com"} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="middleName"
                  label={"Middle Name"}
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={2} placeholder={"e.g. Protacio"} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="contactNumber"
                  label={"Contact #"}
                  rules={[{ required: true, message: "Contact # is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={6} maxLength={13} placeholder={"e.g. 09XX-XXX-XXXX"} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="lastName"
                  label={"Last Name"}
                  rules={[{ required: true, message: "Last Name is required"}]}
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={3} placeholder={"e.g. Dela Cruz"} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem
                  label={"Emergency Contact Person"}
                  name="emergencyContactPerson"
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={7}  placeholder={"e.g. Juana Dela Cruz"} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="civilStatus"
                  label={"Civil Status"}
                  rules={[{required: true, message: "Civil Status is required" }]}
                >
                  <Select disabled={!editingPersonalInfo} placeholder="Select Civil Status" tabIndex={4} >
                    <Option value={CivilStatus.SINGLE}>{titleCase(CivilStatus.SINGLE)}</Option>
                    <Option value={CivilStatus.MARIED}>{titleCase(CivilStatus.MARIED)}</Option>
                    <Option value={CivilStatus.WIDOWED}>{titleCase(CivilStatus.WIDOWED)}</Option>
                    <Option value={CivilStatus.SEPARATED}>{titleCase(CivilStatus.SEPARATED)}</Option>
                    <Option value={CivilStatus.DIVORCED}>{titleCase(CivilStatus.DIVORCED)}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem  name="emergencyContactNumber"
                  label={"Emergency Contact #"}
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={8} maxLength={13} placeholder={"e.g. 09XX-XXX-XXXX"} />
                </FormItem>
              </Col>
            </Row>
            <Divider />
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="birthDate"
                  label={"Date of Birth"}
                  rules={[{ required: true, message: "Date of Birth is required" }]}
                >
                  <DatePicker disabled={!editingPersonalInfo} tabIndex={9} placeholder="Select Date of Birth" format="MMMM D, YYYY"/>
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="age"
                  label={"Age"}
                >
                  <InputNumber disabled={!editingPersonalInfo} tabIndex={11} placeholder={"Enter age"} min={18} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="placeOfBirth"
                  label={"Place of Birth"}
                  rules={[{ required: true, message: "Place of Birth is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingPersonalInfo} tabIndex={10} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="gender"
                  label={"Gender"}
                  rules={[{ required: true, message: "Gender is required" }]}
                >
                  <Radio.Group disabled={!editingPersonalInfo}>
                    <Radio value={Gender.MALE}>{titleCase(Gender.MALE)}</Radio>
                    <Radio value={Gender.FEMALE}>{titleCase(Gender.FEMALE)}</Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="Government IDs" className={styles.card}>
            <EditButton onToggleEdit={() => setEditingGovId(!editingGovId)} isUpdating={isUpdating} />
            <Row gutter={16}>
              <Col span={10} offset={5}>
                <FormItem name="govId_philhealth"
                    label={"Philhealth #"}
                    rules={[{ required: true, message: "Philhealth ID Info is required" }]}
                  >
                    <Input  autoComplete="off" disabled={!editingGovId} tabIndex={12} maxLength={14} placeholder="XXXX-XXXX-XXXX" />
                  </FormItem>
              </Col>
              <Col span={6}>
                <FormItem name="govId_philhealthfile"
                  label={" "}
                  rules={[{ required: !isUpdating, message: "Philhealth ID Document is required" }]}
                >
                  <Upload disabled={!editingGovId}  maxCount={1} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10} offset={5}>
                <FormItem name="govId_sss"
                    label={"SSS #"}
                    rules={[{ required: true, message: "SSS ID Info is required" }]}
                  >
                    <Input  autoComplete="off" disabled={!editingGovId} tabIndex={13} maxLength={12} placeholder="XX-XXXXXXX-X"/>
                  </FormItem>
              </Col>
              <Col span={6}>
                <FormItem name="govId_sssfile"
                  label={" "}
                  rules={[{ required: !isUpdating, message: "SSS ID Document is required" }]}
                >
                  <Upload disabled={!editingGovId} maxCount={1} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10} offset={5}>
                <FormItem name="govId_pagibig"
                    label={"Pag-IBIG #"}
                    rules={[{ required: true, message: "Pag-IBIG ID Info is required"}]}
                  >
                    <Input  autoComplete="off" disabled={!editingGovId} tabIndex={14} maxLength={14} placeholder="XXXX-XXXX-XXXX"/>
                  </FormItem>
              </Col>
              <Col span={6}>
                <FormItem name="govId_pagibigfile"
                  label={" "}
                  rules={[{ required: !isUpdating, message: "Pag-IBIG ID Document is required"}]}
                >
                  <Upload disabled={!editingGovId} maxCount={1} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10} offset={5}>
                <FormItem name="govId_tin"
                    label={"TIN #"}
                    rules={[{ required: true, message: "TIN ID Info is required" }]}
                  >
                    <Input  autoComplete="off" disabled={!editingGovId} tabIndex={15} maxLength={15} placeholder="XXX-XXX-XXX-XXX"/>
                  </FormItem>
              </Col>
              <Col span={6}>
                <FormItem name="govId_tinfile"
                  label={" "}
                  rules={[{ required: !isUpdating, message: "TIN ID Document is required" }]}
                >
                  <Upload disabled={!editingGovId} maxCount={1} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="Onboarding Information" className={styles.card}>
            <EditButton onToggleEdit={() => setEditingOnboardingInfo(!editingOnboardingInfo)} isUpdating={isUpdating} />
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="salary"
                  label={"Salary"}
                  rules={[{ required: true, message: "Employee Salary is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingOnboardingInfo} tabIndex={16} placeholder={"e.g. 10,000"} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <Row gutter={8}>
                  <Col span={12}>
                    <FormItem name="divisionType"
                      label={"Division Type"}
                      rules={[{ required: true, message: "Division is required" }]}
                    >
                      <Select disabled={!editingOnboardingInfo} tabIndex={19} placeholder="Select Division Type">
                        <Option value={DivisionType.MANPOWER}>{titleCase(DivisionType.MANPOWER)}</Option>
                        <Option value={DivisionType.PMO}>{titleCase(DivisionType.PMO)}</Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem name="division"
                      label={divisionLabel}
                      rules={[{ required: true, message: `${divisionLabel} is required` }]}
                    >
                      <Select disabled={!editingOnboardingInfo} tabIndex={19} placeholder={`Select ${divisionLabel}`} loading={loadingDivisions}>
                        {divisions.map(({ identifier, divisionName }) => {
                          return <Option key={identifier} value={identifier}>{titleCase(divisionName)}</Option>
                        })}
                      </Select>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="position"
                  label={"Position"}
                  rules={[{ required: true, message: "Position is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingOnboardingInfo} tabIndex={17} placeholder={"e.g. Manager"} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="employmentStatus"
                  label={"Employment Status"}
                  rules={[{ required: true, message: "Employment Status is required"}]}
                >
                  <Select disabled={!editingOnboardingInfo} tabIndex={20} placeholder="Select Employment Status">
                    <Option value={EmploymentStatus.FLOATING}>{titleCase(EmploymentStatus.FLOATING)}</Option>
                    <Option value={EmploymentStatus.PROBATIONARY}>{titleCase(EmploymentStatus.PROBATIONARY)}</Option>
                    <Option value={EmploymentStatus.REGULAR}>{titleCase(EmploymentStatus.REGULAR)}</Option>
                    <Option value={EmploymentStatus.RELIVER}>{titleCase(EmploymentStatus.RELIVER)}</Option>
                    <Option value={EmploymentStatus.RESIGNED}>{titleCase(EmploymentStatus.RESIGNED)}</Option>
                    <Option value={EmploymentStatus.TERMINATED}>{titleCase(EmploymentStatus.TERMINATED)}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="reportsTo"
                  label={"Reports To"}
                  rules={[{ required: true,  message: "Reports to Person is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingOnboardingInfo} tabIndex={18} placeholder={"e.g. Marge Abalos"} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem  name="startDate"
                  label={"Start Date"}
                  rules={[{ required: true, message: "Start Date is required" }]}
                >
                  <DatePicker disabled={!editingOnboardingInfo} tabIndex={21} placeholder="Select Start Date" format="MMMM D, YYYY"/>
                </FormItem>
              </Col>
            </Row>
          </Card>
          
          <Card title="Present Address" className={styles.card}>
            <EditButton onToggleEdit={() => setEditingPresentAddress(!editingPresentAddress)} isUpdating={isUpdating} />
            <Row gutter={16}>
              <Col span={24}>
                <FormItem name="streetAddress"
                  label={"Street Address"}
                  rules={[{ required: true,  message: "Street Address is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingPresentAddress} tabIndex={22} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem name="addressLine2"
                  label={"Address Line 2"}
                >
                  <Input  autoComplete="off" disabled={!editingPresentAddress} tabIndex={23} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10} >
                <FormItem name="province"
                  label={"Province"}
                  rules={[{ required: true, message: "Province is required" }]}
                >
                  <Select disabled={!editingPresentAddress} tabIndex={24} placeholder="e.g. Metro Manila" showSearch>
                    {provinces.map(({ key, name }: ProvinceProp) => {
                      return <Option key={key} value={name}>{name}</Option>
                    })}
                  </Select>
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="cityMunicipality"
                  label={"City / Municipality"}
                  rules={[{ required: true, message: "City / Municipality is required" }]}
                >
                  <Select disabled={!editingPresentAddress} tabIndex={25} placeholder="e.g. Makati" showSearch>
                    {cities.filter((city: CitiyProps) => {
                      const selectedProvince = provinces.find((province: ProvinceProp) => province.name === provinceValue);
                      return selectedProvince && city.province === selectedProvince.key;
                    }).map(({ city, name }: CitiyProps) => {
                      return <Option key={provinceValue + name} value={name}>{city ? `${name} City` : name}</Option>
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="postalCode"
                  label={"Postal Code"}
                >
                  <Input  autoComplete="off" disabled={!editingPresentAddress} maxLength={4} tabIndex={26} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="country"
                  label={"Country"}
                >
                  <Input  autoComplete="off" disabled />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="Permanent Address" className={styles.card}>
            <EditButton onToggleEdit={() => setEditingPermanentAddress(!editingPermanentAddress)} isUpdating={isUpdating} />
            <div className={styles.sameAsPresent}>
              <FormItem name="sameAsPresent">
                <Checkbox disabled={!editingPermanentAddress}>Same as present address</Checkbox>
              </FormItem>
            </div>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem name="streetAddress_1"
                  label={"Street Address"}
                  rules={[{ required: true,  message: "Street Address is required" }]}
                >
                  <Input  autoComplete="off" disabled={!editingPermanentAddress} tabIndex={27} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <FormItem name="addressLine2_1"
                  label={"Address Line 2"}
                >
                  <Input  autoComplete="off" disabled={!editingPermanentAddress} tabIndex={28} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10} >
                <FormItem name="province_1"
                  label={"Province"}
                  rules={[{ required: true, message: "Province is required" }]}
                >
                  <Select disabled={!editingPermanentAddress} tabIndex={29} placeholder="e.g. Metro Manila" showSearch>
                    {provinces.map(({ key, name }: ProvinceProp) => {
                      return <Option key={key} value={name}>{name}</Option>
                    })}
                  </Select>
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="cityMunicipality_1"
                  label={"City / Municipality"}
                  rules={[{ required: true, message: "City / Municipality is required" }]}
                >
                  <Select disabled={!editingPermanentAddress} tabIndex={30} placeholder="e.g. Makati" showSearch>
                    {cities.filter((city: CitiyProps) => {
                      const selectedProvince = provinces.find((province: ProvinceProp) => province.name === provinceValue);
                      return selectedProvince && city.province === selectedProvince.key;
                    }).map(({ city, name }: CitiyProps) => {
                      return <Option key={provinceValue + name} value={name}>{city ? `${name} City` : name}</Option>
                    })}
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={10}>
                <FormItem name="postalCode_1"
                  label={"Postal Code"}
                >
                  <Input  autoComplete="off" disabled={!editingPermanentAddress} maxLength={4} tabIndex={31} />
                </FormItem>
              </Col>
              <Col span={10} offset={4}>
                <FormItem name="country_1"
                  label={"Country"}
                >
                  <Input  autoComplete="off"disabled />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <div className={styles.submit}>
            <Button type="primary" onClick={() => form?.submit()} loading={submitting}>
              {`${isUpdating ? "Update Details" : "Add Employee"}`}
            </Button>
          </div>
        </PageContainer>
      </div>
    </Form>
  );
};

const mapStateToProps = ({ employee, loading }: ConnectState) => {
  return {
    divisions: employee.divisions,
    isUpdating: employee.isUpdating,
    selectedEmployee: employee.selectedEmployee,
    submitting: loading.effects['employee/createEmployee'],
    loadingDivisions: loading.effects['employee/getEmployeeFormDivisions'],
  }
};

export default connect(mapStateToProps)(EmployeeForm);