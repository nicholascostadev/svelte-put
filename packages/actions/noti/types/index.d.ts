declare module '@svelte-put/noti' {
  import type { SvelteComponent, ComponentEvents, ComponentProps, ComponentType } from 'svelte';
  import type { ActionReturn } from 'svelte/action';
  /**
   * register an HTMLElement as the portal for the provided notification store
   * */
  export function portal(
    node: HTMLElement,
    store: NotificationStore,
  ): NotificationPortalActionReturn;
  /// <reference types="svelte" />

  export function store(
    config?:
      | NotificationCommonConfig<string, import('svelte').SvelteComponent<any, any, any>>
      | undefined,
  ): NotificationStoreBuilder<{}>;
  /**
   * builder for notification store
   *
   */
  class NotificationStoreBuilder<
    VariantMap extends Record<string, import('svelte').SvelteComponent<any, any, any>> = {},
  > {
    constructor(config: NotificationCommonConfig<string, import('svelte').SvelteComponent>);

    commonConfig: Required<NotificationCommonConfig<string, import('svelte').SvelteComponent>>;

    variantConfigMap: Record<
      string,
      NotificationVariantConfig<string, import('svelte').SvelteComponent>
    >;
    counter: number;
    /**
     * add config for a notification variant
     * */
    variant<
      Variant extends string,
      Component extends import('svelte').SvelteComponent<any, any, any>,
    >(
      variant: Variant,
      config:
        | import('svelte').ComponentType<Component>
        | Omit<NotificationVariantConfig<Variant, Component>, 'variant'>,
    ): NotificationStoreBuilder<VariantMap & Record<Variant, Component>>;
    /**
     * Build the actual notification store
     */
    build(): {
      subscribe: (
        this: void,
        run: import('svelte/store').Subscriber<NotificationStoreValue>,
        invalidate?: import('svelte/store').Invalidator<NotificationStoreValue> | undefined,
      ) => import('svelte/store').Unsubscriber;
      readonly notifications: NotificationInstance<
        string,
        import('svelte').SvelteComponent<any, any, any>
      >[];

      portal: HTMLElement | null;
      push: {
        <
          Variant_1 extends Extract<keyof VariantMap, string>,
          Component_1 extends VariantMap[Variant_1] = VariantMap[Variant_1],
          ResolveDetail =
            | import('svelte').ComponentEvents<Component_1>['resolve']['detail']
            | undefined,
        >(
          variant: Variant_1,
          config?: NotificationByVariantPushConfig<Variant_1, Component_1> | undefined,
        ): NotificationPushOutput<Component_1>;

        <
          CustomComponent extends import('svelte').SvelteComponent<any, any, any>,
          ResolveDetail =
            | import('svelte').ComponentEvents<Component_1>['resolve']['detail']
            | undefined,
        >(
          variant: 'custom',
          config: NotificationCustomPushConfig<CustomComponent>,
        ): NotificationPushOutput<CustomComponent>;
      };
      pop: {
        (id?: string | undefined, detail?: any): void;

        (
          config?:
            | {
                id?: string | undefined;
                detail?: any;
              }
            | undefined,
        ): void;
      };
      pause: (id: string) => void;
      resume: (id: string) => void;
    };
  }
  type NotificationProps = {
    notification: NotificationInstance;
  };

  export class Notification extends SvelteComponent<NotificationProps> {}
  type NotificationCommonConfig<Variant extends string, Component extends SvelteComponent> = {
    /**
     * milliseconds to wait and automatically pop the notification.
     * Defaults to `3000`. Set to `false` to disable
     */
    timeout?: number | false;
    /**
     * id generator for notifications. Defaults to 'uuid'.
     *
     * @remarks
     *   - counter: use an auto-incremented counter that is scoped to the store
     *   - uuid: use `crypto.randomUUID()`, fallback to `counter` if not available
     *   - callback: a custom function that accepts {@link NotificationInstanceConfig} and returns a string as the id
     */
    id?:
      | 'counter'
      | 'uuid'
      | ((config: Required<Omit<NotificationInstanceConfig<Variant, Component>, 'id'>>) => string);
  };

  /** predefined variant config provided while building a {@link NotificationStore} */
  type NotificationVariantConfig<
    Variant extends string,
    Component extends SvelteComponent,
  > = NotificationCommonConfig<Variant, Component> & {
    /** string variant representing this config, must be unique within a {@link NotificationStore}  */
    variant: Variant;
    /** any Svelte component used for rendering notification UI */
    component: ComponentType<Component>;
    /** inferred props from `component` */
    props?: Omit<ComponentProps<Component>, 'notification'>;
  };

  /** a resolved config for a {@link NotificationInstance} */
  type NotificationInstanceConfig<
    Variant extends string,
    Component extends SvelteComponent,
  > = Required<Omit<NotificationVariantConfig<Variant, Component>, 'id'>> & {
    id: string;
  };

  type NotificationByVariantPushConfig<
    Variant extends string,
    Component extends SvelteComponent,
  > = NotificationCommonConfig<Variant, Component> & {
    props?: Omit<ComponentProps<Component>, 'notification'>;
  };

  type NotificationCustomPushConfig<Component extends SvelteComponent> = NotificationCommonConfig<
    'custom',
    Component
  > & {
    component: ComponentType<Component>;
    props?: Omit<ComponentProps<Component>, 'notification'>;
  };

  type NotificationInstance<
    Variant extends string = string,
    Component extends SvelteComponent = SvelteComponent,
  > = NotificationInstanceConfig<Variant, Component> & {
    /** reference to the rendered notification component */
    instance?: Component;
    /** internal api for resolving a notification, effectively popping it from the stack */
    $resolve: (
      e: ComponentEvents<Component>['resolve'],
    ) => Promise<ComponentEvents<Component>['resolve']['detail']>;
    progress: NotificationProgressStore;
  };

  type NotificationStoreValue = {
    /** an HTMLElement registered as portal by the `portal` action (use:portal) */
    portal: HTMLElement | null;
    /** the notification stack */
    notifications: NotificationInstance<string, SvelteComponent>[];
  };

  type NotificationStore = ReturnType<NotificationStoreBuilder['build']>;

  type NotificationProgressStoreValue = {
    state: 'idle' | 'running' | 'paused' | 'ended';
  };
  type NotificationProgressStore = ReturnType<typeof createProgressStore>;

  type NotificationPortalAttributes = {
    'on:noti:push'?: (event: CustomEvent<NotificationInstance<string, SvelteComponent>>) => void;
    'on:noti:pop'?: (event: CustomEvent<NotificationInstance<string, SvelteComponent>>) => void;
  };

  type NotificationPortalActionReturn = ActionReturn<
    NotificationStore,
    NotificationPortalAttributes
  >;

  type NotificationPushOutput<Component extends SvelteComponent = SvelteComponent> = {
    id: string;
    /**
     * return a promise that resolves to a detail, either provided from invocation of {@link NotificationStore} pop method,
     * or through the CustomEvent detail of the `resolve` event within the notification component
     */
    resolve: () => Promise<ComponentEvents<Component>['resolve']['detail']>;
  };
  /// <reference types="svelte" />

  function createProgressStore(
    initial?: number | false | undefined,
    onTimeOut?: (() => void) | undefined,
  ): {
    subscribe: (
      this: void,
      run: import('svelte/store').Subscriber<NotificationProgressStoreValue>,
      invalidate?: import('svelte/store').Invalidator<NotificationProgressStoreValue> | undefined,
    ) => import('svelte/store').Unsubscriber;
    resume(): void;
    pause(): void;
    stop(): void;
  };
}

//# sourceMappingURL=index.d.ts.map
