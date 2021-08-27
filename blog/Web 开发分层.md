# 1. 小库java-web-springboot项目建议


## 1.1. 参考文档

1. [springboot官网](https://spring.io/guides/gs/spring-boot/)
2. [SpringBoot中VO,DTO,DO,PO的概念、区别和用处](https://www.jianshu.com/p/0f7583f72187)

领域驱动分层模型
1. DO/PO(Data object/Persistance Object)：与数据表结构对应的对象，ORM的对象
2. BO/DO(Business Object/Domain Object)：业务逻辑对象，service层对象
3. DTO/VO(Data Transfer Object/View Object)：数据传输对象，显示层对象

## 1.2. 目录结构

```
|-  component
|   |-  acomponent
|       |-  SomeClass.java
|   |-  bcomponent
|   |-  ccomponent
|-  controller
|   |-  FristController.java
|   |-  SecondController.java
|-  dto
|   |-  BuildingCreateDTO.java
|   |-  ResidenceEditDTO.java
|-  model
|   |-  db
|       |-  DbBuilding.java
|       |-  DbResidence.java
|   |-  domain
|       |-  Building.java
|       |-  Residence.java
|-  repository(dao)
|   |-  BuildingRepository.java
|   |-  ResidenceRepository.java
|-  service
|   |-  impl
|       |-  BuildingServiceImpl.java
|       |-  ResidenceServiceImpl.java
|   |-  BuildingService.java
|   |-  ResidenceService.java
|-  util
|   |-  SomeUtil.java
|-  viewmodel
|   |-  BuildingViewModel
|   |-  ResidenceViewModel
```

## 1.3. 目录结构解析

1. Controller层
controller层是接口层，controller层只能调用service层方法，避免直接调用dao层（repository),controller层的输入应该为dto或者vm，输出应为dto或者vm，如果该项目结构简单，没有dto和vm，也可以直接输入domain对象，输出domain对象，样例如下

    ```java
      /**
        * 保存方案（自动保存或手动保存）
        *
        * @param projectId
        * @return
        */
        @PutMapping("/{projectId}")
        @LoginRequired
        public Resp<ProjectDTO> saveProject(@PathVariable long projectId,
            @RequestBody @Valid ProjectDTO projectDTO) {
            if (projectId != projectDTO.getId()) {
                throw new BusinessException("项目数据不匹配");
            }
            // 检查权限
            authorizationService.requireProjectOwner(projectId);
            // 保存项目
            Project project = projectService.saveProject(projectDTO);
            // 转为dto
            ProjectDTO resultDTO = ProjectDTO.of(project);
            return Resp.data(resultDTO);
        }
    ```

2. Service层
service层处理业务逻辑，service之间可以互相调用，单例模式自动注入不存在循环引用的说法，但实际使用中应该尽量避免过多的互相调用，导致逻辑耦合。习惯上来说，service层在spring中会先声明interface，然后再实现对应的接口，这样的好处是能够比较清晰的把所有业务逻辑的方法统一起来放在一起，看到每个方法的作用和输入输出。但是不是必须的

3. DAO层（Repository)
dao层是数据库交互层，直接和数据库打交道，没有任何的业务逻辑，只包含简单的查询封装，至于说什么情况下需要用什么条件过滤，逻辑应该写在service层，返回db对象。另外，使用JPA框架的话，dao层命名为Repository，jpa中已经预先写好接口，只需要在repository中声明方法即可，例如：

    ```java
    public interface BuildingRepository extends JPARepository<Long, DbBuilding> {
        DbBuilding findAllByBuildingTypeAndCreatedBy(BuildingType buildingType, long createdBy);
    }
    ```
4. model层
model层需要细分为2层，第一为db层，db层的模型只声明数据库的字段属性和关系，没有任何的业务逻辑。第二层为domain层，domain层与db层一一对应，通常属性也会一一对应（或者有额外的计算字段，例如db里面存储dbBuilding.floorNumber和dbBuilding.floorHeight，domain层的building就可以有building.height的属性），所有的业务逻辑使用domain层来计算，只有需要存储数据库的时候，才通过domain层对象转换为db层对象存储。这样做是为了杜绝orm中任何属性的编辑都会引起数据库同步的变动，这可能是我们所不希望的。同时也把业务逻辑跟数据库层面独立开来。
特别小型的项目中，也可以去掉domain这一层，但是不建议大型项目这么做。

    ```java
    @Entity  // 这是dbmodel
    public class DbBuilding extends DbModelBase{  // 基本模型存储公共字段，例如创建时间，修改时间，deleted这些
        @Id
        private long id;
        @Column
        private int floorNumber;
        @Column
        private double floorHeight;
    }

    @Data  // 这是domain类型
    public class Building {
        private long id;
        private int floorNumber;
        private double floorHeight;
        private double height;  // 也可以写成get方法，这里只是为了说明可以新增属性

        public static fromDb(DbBuilding dbBuilding) {
            Building building = new Building();
            BeanUtils.copyProperties(dbBuilding, building);
            building.height = building.floorNumber * building.floorHeight;
            return building;
        }

        public DbBuilding toDb() {
            DbBuilding dbBuilding = new DbBuilding();
            BeanUtils.copyProperties(this, dbBuilding);
            return dbBuilding;
        }

        // 具体的业务逻辑
        public double getArea(){
            ...
        }

    }
    ```

5. dto层和view model层
一般来说，我们会用view model层或者dto层来声明与其他服务相关的接口。与前端表单相关的会命名为view model，与其他内部服务相关的命名为dto，当然也可以统一命名为dto或vm也没有关系。

6. component和util
util为工具类方法，component为其中一些比较独立的模块，简单的模块可以放在util中，比较庞大的模块，又跟主要的业务逻辑没有太大关系的，可以创建一个component