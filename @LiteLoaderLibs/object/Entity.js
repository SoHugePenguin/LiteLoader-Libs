import { Item } from "./Item.js";
import { Block } from "./Block.js";
import { DirectionAngle } from './DirectionAngle.js';
import { IntPos } from './IntPos.js';
import { FloatPos } from './FloatPos.js';
import { Player } from "./Player.js";
import { PlayerArmorContainer } from "../container/PlayerArmorContainer.js";
import { Player as PNXPlayer } from 'cn.nukkit.Player';
import { Entity as PNXEntity } from 'cn.nukkit.entity.Entity';
import { EntityItem } from 'cn.nukkit.entity.item.EntityItem';
import { Position } from 'cn.nukkit.level.Position'
import { getLevels } from '../utils/Mixins.js';
import { Vector3 } from 'cn.nukkit.math.Vector3';
import { Collectors } from "java.util.stream.Collectors";
import { EntityMob } from "cn.nukkit.entity.mob.EntityMob";
import { EntityArmorStand } from "cn.nukkit.entity.item.EntityArmorStand";
import { Container } from "../container/Container.js";
import { EntityHumanType } from "cn.nukkit.entity.EntityHumanType";
import { NbtCompound } from '../nbt/NbtCompound.js';
import { BlockWallBase } from 'cn.nukkit.block.BlockWallBase';
import { BlockNetherPortal } from 'cn.nukkit.block.BlockNetherPortal';
import { BlockEndPortal } from 'cn.nukkit.block.BlockEndPortal';
import { BlockWitherRose } from 'cn.nukkit.block.BlockWitherRose';
import { BlockSnow } from 'cn.nukkit.block.BlockSnow';
import { BlockPowderSnow } from 'cn.nukkit.block.BlockPowderSnow';
import { BlockLava } from 'cn.nukkit.block.BlockLava';
import { BlockMagma } from 'cn.nukkit.block.BlockMagma';
import { BlockCampfireSoul } from 'cn.nukkit.block.BlockCampfireSoul';
import { BlockCampfire } from 'cn.nukkit.block.BlockCampfire';
import { BlockFireSoul } from 'cn.nukkit.block.BlockFireSoul';
import { BlockFire } from 'cn.nukkit.block.BlockFire';
import { EntityWolf } from 'cn.nukkit.entity.passive.EntityWolf';
import { EntityAgeable } from 'cn.nukkit.entity.EntityAgeable';

export class Entity {
    /**
     * @param Entity {PNXEntity}
     */
    constructor(Entity) {
        this._PNXEntity = Entity;
        this.DirectionAngle = new DirectionAngle(this._PNXEntity);
    }

    get name() {// 实体名称	String
        return this._PNXEntity.getName();
    }

    get type() {// 实体标准类型名	String
        return this._PNXEntity.getOriginalName();
    }

    get id() {// 实体的游戏内 id	Integer
        return this._PNXEntity.getId();
    }

    get pos() {// 实体所在坐标  FloatPos
        return new FloatPos(this._PNXEntity.getPosition());
    }

    get blockPos() {// 实体所在的方块坐标	IntPos
        return new IntPos(this._PNXEntity.getPosition());
    }

    get maxHealth() {// 实体最大生命值	Integer
        return this._PNXEntity.getMaxHealth();
    }

    get health() {// 实体当前生命值  Integer
        return this._PNXEntity.getHealth();
    }

    get inAir() {// 实体当前是否悬空  Boolean
        return this._PNXEntity.getAirTicks() > 0;
    }

    get inWater() {// 实体当前是否在水中		Boolean
        return this._PNXEntity.isSwimming();
    }

    /**
     * @returns {boolean} 实体是否在岩浆中
     */
    get inLava() {
        return this._PNXEntity.isInsideOfLava();
    }

    /**
     * todo 未实现
     * @returns {boolean} 实体是否在雨中
     */
    get inRain() {
        return false;
    }

    /**
     * @returns {boolean} 实体是否在雪中
     */
    get inSnow() {
        return this._checkCollisionBlocks([BlockSnow, BlockPowderSnow]);
    }

    /**
     * @returns {boolean} 实体是否在墙上
     */
    get inWall() {
        return this._checkCollisionBlocks([BlockWallBase]);
    }

    /**
     * @returns {boolean} 实体是否在水中或雨中
     */
    get inWaterOrRain() {
        return this.inWater;
    }

    /**
     * todo 不懂什么意思
     * @returns {boolean} 实体是否在世界中
     */
    get inWorld() {
        return true;
    }

    /**
     * @returns {boolean} 实体是否不可见
     */
    get isInvisible() {
        return this._PNXEntity.getDataPropertyBoolean(PNXEntity.DATA_FLAG_INVISIBLE);
    }

    /**
     * @returns {boolean} 实体是否在门户内
     */
    get isInsidePortal() {
        return this._checkCollisionBlocks([BlockEndPortal, BlockNetherPortal]);
    }

    /**
     * todo 不知道啥意思
     * @returns {boolean} 实体是否信任
     */
    get isTrusting() {
        return true;
    }

    /**
     * @returns {boolean} 实体是否接触到伤害方块
     */
    get isTouchingDamageBlock() {
        return this._checkCollisionBlocks([BlockLava, BlockWitherRose, BlockMagma, BlockFire, BlockFireSoul, BlockCampfire, BlockCampfireSoul]);
    }

    /**
     * @returns {boolean} 实体是否在地面
     */
    get isOnGround() {
        return !this.inAir;
    }

    /**
     * @returns {boolean} 实体是否在岩浆块上
     */
    get isOnHotBlock() {
        return this._checkCollisionBlocks([BlockMagma]);
    }

    /**
     * todo pnx未实现检测
     * @returns {boolean} 实体是否在交易
     */
    get isTrading() {
        if (this._PNXEntity instanceof PNXPlayer) {

        }
        return false;
    }

    /**
     * todo pnx未实现检测
     * @returns {boolean} 实体是否正在骑行
     */
    get isRiding() {
        if (this._PNXEntity instanceof PNXPlayer) {

        }
        return false;
    }

    /**
     * todo pnx未实现检测
     * @returns {boolean} 实体是否在跳舞
     */
    get isDancing() {
        if (this._PNXEntity instanceof PNXPlayer) {

        }
        return false;
    }

    /**
     * @returns {boolean} 实体是否在睡觉
     */
    get isSleeping() {
        if (this._PNXEntity instanceof PNXPlayer) {
            return this._PNXEntity.isSleeping();
        }
        return false;
    }

    /**
     * @returns {boolean} 实体是否生气
     */
    get isAngry() {
        if (this._PNXEntity instanceof EntityWolf) {
            return this._PNXEntity.isAngry();
        }
        return false;
    }

    /**
     * @returns {boolean} 实体是否为幼体
     */
    get isBaby() {
        if (this._PNXEntity instanceof EntityAgeable) {
            return this._PNXEntity.isBaby();
        }
        return false;
    }

    /**
     * todo pnx未实现检测
     * @returns {boolean} 实体是否移动
     */
    get isMoving() {
        return true;
    }

    get speed() {// 实体当前速度	Float
        return this._PNXEntity.getMovementSpeed();
    }

    get direction() {// 实体当前朝向	Boolean
        return this.DirectionAngle;
    }

    get uniqueId() {// 实体唯一标识符	String
        return this._PNXEntity.getUniqueId().toString();
    }

    /**
     * 按照输入检查实体碰撞到的方块
     * @pnxonly
     * @param blocks {Array} 目标检查的方块数组
     * @return boolean 实体是否碰撞到目标方块
     */
    _checkCollisionBlocks(blocks) {
        for (let block of this._PNXEntity.getCollisionBlocks()) {
            blocks.map((v, i) => {
                if (block instanceof v) {
                    return true;
                }
            });
        }
        return false
    }

    /**
     * 传送实体至指定位置
     * @param x {IntPos|FloatPos|Number} 目标位置坐标
     * @param y {Number}
     * @param z {Number}
     * @param dimid {Number}
     * @returns {boolean} 是否成功传送
     */
    teleport(x, y, z, dimid) {
        if (arguments.length === 1) {
            return this._PNXEntity.teleport(x.position);
        } else {
            const level = getLevels()[dimid];
            if (level == null) {
                console.log('\nUnknow worlds: ' + dimid + '\n  at Entity.js -> teleport()');
                return false;
            }
            return this._PNXEntity.teleport(Position.fromObject(new Vector3(x, y, z), level));
        }
    }

    /**
     * 杀死实体
     * @returns {boolean} 是否成功执行
     */
    kill() {
        this._PNXEntity.kill();
        return !this._PNXEntity.isAlive();
    }

    /**
     * 对实体造成伤害
     * @param damage {Integer} 对实体造成的伤害数值
     * @returns {boolean} 是否造成伤害
     */
    hurt(damage) {
        return this._PNXEntity.attack(damage);
    }

    /**
     * 使指定实体着火
     * @param time {Integer} 着火时长，单位秒
     * @returns {boolean} 是否成功着火
     */
    setOnFire(time) {
        this._PNXEntity.setOnFire(time);
        return this._PNXEntity.isOnFire();
    }

    /**
     * 判断一个实体对象是不是玩家
     * @returns {boolean} 当前实体对象是不是玩家
     */
    isPlayer() {
        return this._PNXEntity instanceof PNXPlayer;
    }

    /**
     * 将实体对象转换玩家对象
     * @returns {Player} 转换成的玩家对象,如果此实体对象指向的不是某个玩家,或者转换失败，则返回Null
     */
    toPlayer() {
        if (this.isPlayer()) return Player.getPlayer(this._PNXEntity);
        else return null;
    }

    /**
     * 判断一个实体对象是不是掉落物实体
     * @returns {boolean} 当前实体对象是不是掉落物实体
     */
    isItemEntity() {
        return this._PNXEntity instanceof EntityItem;
    }

    /**
     * 获取掉落物实体中的物品对象
     * @todo 进行测试
     * @returns {Item} 获取到的物品对象,如果此实体对象不是掉落物实体，或者获取失败，则返回 Null
     */
    toItem() {
        if (this.isItemEntity()) return new Item(this.getItem(), null);
        else return null;
    }

    /**
     * 获取实体当前站立所在的方块
     * @todo 进行测试
     * @returns {Block} 当前站立在的方块对象
     */
    getBlockStandingOn() {
        return new Block(this._PNXEntity.getPosition().add(0, -0.1).getLevelBlock());
    }

    /**
     * 获取实体盔甲栏对象
     * @todo 测试
     * @returns {Container} Container对象
     */
    getArmor() {
        if (this._PNXEntity instanceof EntityMob || this._PNXEntity instanceof EntityArmorStand) {
            return new Container(this._PNXEntity.getArmorInventory());
        } else if (this._PNXEntity instanceof PNXPlayer) {
            return new PlayerArmorContainer(this._PNXEntity.getInventory());
        } else return null;
    }

    /**
     * 判断生物是否拥有容器（盔甲栏除外）
     * @todo 由于Pnx目前没有实现带容器实体(驴 羊驼 马),只检测玩家
     * @returns {Boolean} 这个生物实体是否拥有容器
     */
    hasContainer() {
        if (this instanceof EntityHumanType) {
            return true;
        } else return false;
    }

    /**
     * 获取生物所拥有的容器对象（盔甲栏除外）
     * @todo 待实现
     * @returns {Container} 这个生物实体所拥有的容器对象
     */
    getContainer() {
        if (this.hasContainer()) {
            if (this.isPlayer()) {
                return new Container(this.getInventory());
            }
        }
        return null
    }

    /**
     * 刷新生物物品栏、盔甲栏
     * @todo 待实现
     * @returns {boolean} 是否成功刷新
     */
    refreshItems() {
        if (this._PNXEntity instanceof EntityHumanType) {
            this._PNXEntity.getInventory().sendContents(this._PNXEntity);
            this._PNXEntity.getInventory().sendArmorContents(this._PNXEntity);
            return ture;
        } else if (this._PNXEntity instanceof EntityMob || this._PNXEntity instanceof EntityArmorStand) {
            let iter = this._PNXEntity.getViewers().iterator();
            while (iter.hasNext()) {
                let pl = iter.next();
                this._PNXEntity.getInventory().sendArmorContents(pl);
            }
            return true;
        }
        return false
    }

    /**
     * 为实体增加一个 Tag
     * @param tag {string} 要增加的 tag 字符串
     * @returns {boolean} 是否成功
     */
    addTag(tag) {
        if (this._PNXEntity.containTag(tag)) {
            return false;
        }
        this._PNXEntity.addTag(tag);
        return true;
    }

    /**
     * 为实体移除一个 Tag
     * @param tag {string} 要移除的 tag 字符串
     * @returns {boolean} 是否成功
     */
    removeTag(tag) {
        if (!this._PNXEntity.containTag(tag)) {
            return false;
        }
        this._PNXEntity.removeTag(tag);
        return true;
    }

    /**
     * 检查实体是否拥有某个 Tag
     * @param tag {string} 要检查的 tag 字符串
     * @returns {boolean} 是否拥有
     */
    hasTag(tag) {
        return this._PNXEntity.containTag(tag);
    }

    /**
     * 获取实体拥有的所有 Tag 列表
     * @returns {String[]} 玩家所有的 tag 字符串列表
     */
    getAllTags() {
        return this._PNXEntity.getAllTags().stream().map(item => {
            return item.parseValue()
        }).distinct().collect(Collectors.toList());
    }

    /**
     * 获取实体对应的 NBT 对象
     * @returns {NbtCompound} LLSE的NbtCompound对象
     */
    getNbt() {
        return new NbtCompound(this._PNXEntity.namedTag);
    }

    /**
     * 写入实体对应的 NBT 对象
     * @param nbt {NbtCompound} NBT 对象
     * @returns {boolean} 是否成功
     */
    setNbt(nbt) {
        if (!nbt._pnxNbt.isEmpty()) {
            this._PNXEntity.namedTag = nbt._pnxNbt;
            return true;
        }
        return false;
    }
}